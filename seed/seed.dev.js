const seedDB = require("./seed");
const mongoose = require("mongoose");
const { DB_URL } = require("../config");
const {
  articleData,
  commentsData,
  topicsData,
  userData
} = require("./devData");

mongoose
  .connect(
    DB_URL,
    { useNewUrlParser: true }
  )
  .then(() => {
    return seedDB(articleData, commentsData, topicsData, userData);
  })
  .then(() => mongoose.disconnect())
  .catch(console.log);

