import '../extend/art-template.js'
export let setTemplate = (app, config) => {
  const {  views, env } = config;
 //合并插件中的view
  const all = [...views, 'app/modules/web/view'];
  app.set("view options", {
    debug: env === "dev",
    cache: env === "prd",
    minimize: true,
  });
  app.set("view engine", "html");
  app.set("views", all);
  app.engine(".html", requirejs("express-art-template"));
};
