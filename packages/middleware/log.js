import morgan from "morgan";
export const log = (app,logger) => {
    app.use(morgan(logger.level));
};
