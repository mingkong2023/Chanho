export let setHeader =  (app, { appName, version })=>{
  app.use((req, res, next) => {
    res.setHeader("Create-By", "Chanjs");
    res.setHeader("X-Powered-By", "ChanCMS");
    res.setHeader("ChanCMS", version);
    res.setHeader("Server", appName);
    next();
  });
};
