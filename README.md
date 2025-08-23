
# Chanho

Chanho(禅火：以禅心驭火焰) 是一个基于 Hono+Knex+MySQL+Zod+Vue3 构建的轻量级 MVC 框架，遵循 JavaScript 优先原则。它体现了函数式编程的概念，提供了卓越的性能、清晰的代码和易于遵循的过程，确保了高可维护性。

> 🌟 开发友好，推崇JS优先。适合全栈开发者，独立而高效、优雅的代码、极致的性能、稳定的生产实践，灵活强大。

## 特点

- 基于 Hono 构建
- 基于 EMSA 语法
- 模块化设计
  - 多模块化路由
  - 模块化 views
  - 模块化 controllers
  - 模块化 services
- 插件式架构
- 灵活强大
- 缓存支持
  
## 依赖环境

```javascript
Node.js v22.18.0
pm2 v6.0.8
```

## 约定优于配置

```code
|- app
    |- helper      //工具函数
    |- common      //通用函数库(分页, 文件上传, 加密, 解密, 校验, 转换, 等)
    |- extend      //第三方组件扩展（hono和第三方组件的扩展）
    |- middleware  //全局中间件
    |- modules     //多模块mvc
        |- module1 
            |- controller 
            |- service 
            |- model  //数据库模型 (可选)
            |- view 
            |- router.js 
        |- module2 
            |- controller 
            |- service 
            |- view 
            |- router.js
    |- plugin //插件
        |- plus-module1 
            |- controller 
            |- service 
            |- view 
            |- router.js 
        |- module2 
            |- controller 
            |- service 
            |- view 
            |- router.js
|- config 
|- public
|- index.js
|-.env.dev
|-.env.prd

```

### 初始化过程

- 初始化
- 加载配置
- 加载模块
  - 加载路由
- 加载扩展
- 加载插件
  - 加载路由
- `beforeStart()` 钩子用于将数据库中的配置合并到配置中
- `run()` 启动服务器

### 功能亮点

- 配置文件
- 多模块 MVC 结构
- 插件 MVC 支持
- CORS 跨域配置支持
- 多数据库支持 （PostgreSQL、MySQL / MariaDB、SQLite3、Oracle Database、MSSQL）
- 路由控制
- Art-template 模板引擎
- 静态资源管理
- Cookie 处理
- 日志功能

### 运行

```javascript
import Chanho from "chanho";
const app = new Chanho()
await app.init()
app.start()

```

### 开发模板 （推荐）

- 1. 克隆项目

```bash
git clone https://github.com/mingkong2023/chanhox.git
cd chanhox
```

- 2. 安装依赖

```bash
npm install
```

- 3. 配置数据库

在 `.env` 文件中配置 MySQL 数据库连接信息。

```bash
# .env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=chanho_db

# JWT Secret (可选)
JWT_SECRET=your_jwt_secret_key
```

- 4. 初始化数据库

```bash
npm run migrate
npm run seed
```

- 5. 运行项目

```bash
npm run dev
```
