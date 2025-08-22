import { Hono } from "hono";
export default (app) => {
  //const router = new Hono();

  app.on('GET', ['/', '/index.html'], (c) => {
    return c.text('hello');
  });

 // app.route("/", router); // ✅ 挂载到根路径，因为 router 自己带 /api
};
