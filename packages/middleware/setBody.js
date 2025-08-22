import express from "express";

let setBody = function (app, JSON_LIMIT) {
  app.use(express.json({ limit: JSON_LIMIT }));
  app.use(express.urlencoded({ extended: false }));
};

export {
  setBody
}