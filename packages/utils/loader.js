import fs from 'fs';
import path from 'path';
import { bindClass } from './bind.js';

/**
 * 
 * @param {*} module 模块目录
 * @returns Array 
 * @description 将web模块放到最后加载
 */
export const loaderSort = (modules=[])=>{
  const index = modules.indexOf('web');
  if (index !== -1) {
      const web = modules.splice(index, 1);
      modules.push(web[0]);
  }
  return modules;
}

export const getPackage = async function(){
  let pkg = await importFile('package.json')
  return pkg;
}

export const loadConfig = async function(){
  let config = await importFile('config/index.js')
  return config;
}


/**
 * 加载指定模块名下的所有控制器文件
 * @param {string} moduleName - 模块名称
 * @returns {Promise<Object>} - 控制器对象
 */
export const loadController = async function (moduleName) {
  const controller = {};

  const dir = path.join(MODULES_PATH, moduleName,'controller');

  if (!fs.existsSync(dir)) {
    console.warn(`模块路径不存在，跳过加载控制器: ${dir}`);
    return controller;
  }

  const files = fs.readdirSync(dir).filter(file => file.endsWith('.js'));

  for (const file of files) {
    const filePath = path.join(dir, file);
    const name = file.replace(/\.js$/i, ''); // 安全处理 .js 后缀

    try {
      const module = await importFile(filePath);
      controller[name] = { ...module};
    } catch (e) {
      console.error(`加载控制器失败: ${filePath}`, e);
      // 可选：抛出错误或继续加载其他文件
      // throw e;
    }
  }

  return controller;
};


 