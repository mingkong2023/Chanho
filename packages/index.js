import { serve } from "@hono/node-server";
import { Hono } from "hono";

import "./common/global.js";
import path from "path";
import fs from "fs";
import {
  bindClass,
  db,
  loaderSort,
  getPackage,
  loadConfig,
  loadController,
} from "./utils/index.js";
// import { express, z } from "./extend/import.js";
// import { Controller, Service } from "./core/index.js";
// import {
//   log,
//   setCookie,
//   setFavicon,
//   setBody,
//   setStatic,
//   setHeader,
//   setTemplate,
//   Cors,
//   validator,
// } from "./middleware/index.js";

class Honox {
  #version = "1.0.0"; //版本号

  static Config = {}; //配置文件
  static Helper = {}; //工具函数库
  static Common = {}; //通用函数库(分页, 加密, 解密, 校验, 转换, 等)
  static Service = {}; //服务
  static Controller = {}; //控制器
  static Middleware = {}; //中间件
  static Extend = {}; //第三方组件扩展
  static Plugin = {}; //插件

  constructor() {
    this.app = new Hono();
  }

  version() {
    return this.#version;
  }

  async init() {
    await this.config();
    this.loadDB();
    this.loadCommonRouter();
    this.loadRouter();
  }

  async config() {
    let config = await loadConfig();
    Honox.Config = config;
  }
  //数据库操作
  loadDB() {
    if (Honox.Config?.db?.length > 0) {
      Honox.Config.db.map((item, index) => {
        if (item.key) {
          Honox[`DB${item.key}`] = db(item);
        } else {
          Honox[`DB`] = db(item);
        }
      });
    }
  }

  async loadCommonRouter() {
    try {
      let router = await importRootFile("app/router.js");
      router(this.app);
    } catch (error) {
      console.log(error);
    }
  }

  async loadRouter() {
    const configPath = path.join(APP_PATH, "modules");
    if (fs.existsSync(configPath)) {
      const dirs = loaderSort(Honox.Config.modules);
      for (const item of dirs) {
        let router = await importRootFile(`app/modules/${item}/router.js`);
        console.log(`加载模块：${router}`);
        router(this.app);
      }
    }
  }

  start(port = 3000, cb) {
    serve(
      {
        fetch: this.app.fetch,
        port,
      },
      (info) => {
        console.log(`Server is running on http://localhost:${info.port}`);
        cb && cb(info);
      }
    );
  }
}

global.Honox = Honox;

export default Honox;
