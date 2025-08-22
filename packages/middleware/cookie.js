import cookieParser from "cookie-parser";
export const setCookie = (app,cookieKey) => {
   app.use(cookieParser(cookieKey));
};
