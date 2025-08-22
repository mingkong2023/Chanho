import { Hono } from "hono";
export default (app) => {
  const router = new Hono();

  router.get("/", (c) => c.text("base"));

  app.route("/base", router); // ✅ 挂载到根路径，因为 router 自己带 /api
};
