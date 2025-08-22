
import path from "path";
import fs from "fs";
import { pathToFileURL } from 'url';  // 新增顶部导入
import dotenv from "dotenv";

const ROOT_PATH = process.cwd();
const APP_PATH = path.join(ROOT_PATH, "app");
const CONFIG_PATH = path.join(APP_PATH, "config");
const EXTEND_PATH = path.join(APP_PATH, "extend");
const PUBLIC_PATH = path.join(APP_PATH, "public");
const MODULES_PATH = path.join(APP_PATH, "modules");
// 兼容低版本node common包
import { createRequire } from "module";
const requirejs = createRequire(import.meta.url);

//let user = getFilePath('app/controller/user.js')

//实现dirname
global.__dirname = path.dirname(new URL(import.meta.url).pathname);
//实现__filename
global.__filename = new URL(import.meta.url).pathname;

//加载环境变量
const envFile = process.env.ENV_FILE || '.env.prd'
dotenv.config({ path: path.join(ROOT_PATH, envFile) })

// app
global.APP_PATH = APP_PATH;
// config
global.CONFIG_PATH = CONFIG_PATH;
// run root path
global.ROOT_PATH = ROOT_PATH;
// extend
global.EXTEND_PATH = EXTEND_PATH;
// public
global.PUBLIC_PATH = PUBLIC_PATH;
// modules
global.MODULES_PATH = MODULES_PATH;
// require 兼容低版本node common包
global.requirejs = requirejs;
//解决多重...问题
const importRootFile = async (str) => {
  let filepath = path.join(global.ROOT_PATH, str);
  if (fs.existsSync(filepath)) {
    const fileUrl = pathToFileURL(filepath).href; // 新增转换
    const module = await import(fileUrl);
    return module.default || module;
  }
};

const importFile = async (filepath) => {
  if (fs.existsSync(filepath)) {
    const fileUrl = pathToFileURL(filepath).href; // 新增转换
    const module = await import(fileUrl);
    return module.default || module;
  }
};

global.importFile = importFile;
global.importRootFile = importRootFile;
