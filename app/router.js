import { Hono } from "hono";
export default (app) => {

  app.notFound((c) => {
    return c.text('Custom 404 Message', 404)
  })

  app.onError((err, c) => {
    console.error(`${err}`)
    return c.text('Custom Error Message', 500)
  })
  // const router = new Hono();

  // router.get("/", (c) => c.text("Hello World!"));

  // app.route("/api", router); // ✅ 挂载到根路径，因为 router 自己带 /api
};
