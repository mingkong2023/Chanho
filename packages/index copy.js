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
import { express, z } from "./extend/import.js";
import { Controller, Service } from "./core/index.js";
import {
  log,
  setCookie,
  setFavicon,
  setBody,
  setStatic,
  setHeader,
  setTemplate,
  Cors,
  validator,
} from "./middleware/index.js";

class Chan {
  static helper = {
    bindClass,
    getPackage,
    loadController,
    db,
    z,
    validator,
  }; 
  static config = {}; //配置
  static Service = Service; //服务
  static Controller = Controller; //控制器
  static extend = {}; //组件扩展
  static middleware = {}; //中间件

  constructor() {
    this.app = express();
    this.router = express.Router();
  }

  beforeStart(cb) {
    cb && cb();
  }

  async init() {
    await this.config();
    await this.loadExtend(); //utils
    this.loadMiddleware();
    this.loadDB();
  }

  //加载配置文件
  async config() {
    let config = await loadConfig();
    Chan.config = config;
  }

  //加载中间件
  async loadMiddleware() {
    const {
      views,
      env,
      appName,
      version,
      cookieKey,
      BODY_LIMIT,
      statics,
      logger,
      cors,
    } = Chan.config;

    log(this.app, logger);
    setFavicon(this.app);
    setCookie(this.app, cookieKey);
    setBody(this.app, BODY_LIMIT);
    setTemplate(this.app, { views, env });
    setStatic(this.app, statics);
    Cors(this.app, cors);
    setHeader(this.app, { appName, version });
  }

  //数据库操作
  loadDB() {
    if (Chan.config?.db?.length > 0) {
      Chan.config.db.map((item, index) => {
        if (index == 0) {
          Chan.knex = db(item);
        } else {
          Chan[`knex${index}`] = db(item);
        }
      });
    }
  }

  async loadRouter() {
    const configPath = path.join(APP_PATH, "modules");
    if (fs.existsSync(configPath)) {
      const dirs = loaderSort(Chan.config.modules);
      for (const item of dirs) {
        let router = await importRootFile(`app/modules/${item}/router.js`);
        router(this.app, this.router, Chan.config);
      }
    }
  }

  //通用路由，加载错误处理和500路由和爬虫处理
  async loadCommonRouter() {
    try {
      let router = await importRootFile("app/router.js");
      router(this.app, this.router, Chan.config);
    } catch (error) {
      console.log(error);
    }
  }

  async loadExtend() {
    if (fs.existsSync(EXTEND_PATH)) {
      const files = fs
        .readdirSync(EXTEND_PATH)
        .filter((file) => file.endsWith(".js"));
      for (const file of files) {
        const filePath = path.join(EXTEND_PATH, file);
        let helperModule = await importFile(filePath);
        Chan.helper[file.replace(".js", "")] = helperModule;
      }
    }
  }

  async start(cb) {
    await this.init();
    await this.loadRouter();
    await this.loadCommonRouter();

    cb && cb();
  }

  getAllRouter() {
    // 获取所有路径
    const routes = this.router.stack
      .filter((r) => r.route) // 过滤掉中间件
      .map((r) => ({
        path: r.route.path,
        methods: Object.keys(r.route.methods),
      }));

    console.log(routes);
  }

  run(cb) {
    const port = Chan.config.port || "81";
    this.app.listen(port, () => {
      cb ? cb(port) : console.log(`Server is running on port ${port}`);
    });
  }
}

global.Chan = Chan;
export default Chan;
