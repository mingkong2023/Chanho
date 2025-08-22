import express from "express";

export const setStatic = async function (app, statics) {
  if (statics.length > 0) {
    statics.forEach((item) => {
      const { prefix, dir, maxAge } = item;
      app.use(prefix, express.static(dir, { maxAge: maxAge || 0 }));
    });
  }
};
