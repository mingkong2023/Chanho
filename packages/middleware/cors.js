import cors from "cors";
export const Cors = (app,_cors) => {
    app.use(cors(_cors));
};