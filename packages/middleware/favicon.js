import path from "path";
import favicon from "serve-favicon";
export const setFavicon = (app) => {
  app.use(favicon(path.join(ROOT_PATH, "public/favicon.ico")));
};
