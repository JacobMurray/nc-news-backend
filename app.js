const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const DB_URL = process.env.DB_URL || require("./config").DB_URL;
const { topicsRouter, articleRouter, commentRouter, userRouter } = require("./routes");
const { handle404, handle400, handle500 } = require("./error_handling");

mongoose.connect(
  DB_URL,
  () => {
    console.log(`connected to ${DB_URL}`);
  }
);
app.use(bodyParser.json());
app.get("https://jacobserver.herokuapp.com/", (req, res) => res.render('homepage'));
app.use("/api/topics", topicsRouter);
app.use("/api/articles", articleRouter);
app.use("/api/comments", commentRouter);
app.use("/api/users", userRouter);

app.use("/*", (req, res, next) => next({ status: 404, message: "page not found" }));
app.use(handle404);
app.use(handle400);
app.use(handle500);
//5bbe5d141759d52dc3d0ff1b

module.exports = app;
