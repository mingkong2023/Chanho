# Tea 

## 依赖
nodejs 22.18.0

## 项目架构
```
|- app
    |- common 公共函数
    |- middleware 中间件
    |- validator 验证器
    |- modules 模块
       |- web web模块（首页 列表页 详情页面 搜索页 封面页 专题页 单页）
       |- user 用户模块 (注册 登录 收藏 个人中心 投稿 评论)
       |- api 接口模块
       |- system 系统模块（站点）
         |- site 站点模型
         |- user 用户模型
         |- role 角色模型
         |- permission 权限模型
         |- menu 菜单模型
         |- config 配置模型
         |- log 登录日志 & 操作日志 
         |- security 安全模型
       |- cms cms模块（栏目 内容 标签 友情链接 轮播 广告 碎片管理 模型扩展 采集）
    |- router 通用路由
    |- extend 第三方包扩展
|- plugin 插件
   |- mail 邮件模块
   |- wechat 微信模块
   |- oss 七牛云模块
|- config 配置文件
|- public 公共资源目录
   |- upload
   |- admin
   |- theme 
|- view
   |- default
   |- user
|- index.ts
```







```
npm install
npm run dev
```

```
open http://localhost:3000
```
