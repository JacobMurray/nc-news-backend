const mongoose = require("mongoose");
const { Article, Comment, Topic, User } = require("../models");
const {
  createRefObj,
  formatArticleData,
  formatCommentData,
  createArticleRefObj
} = require("../utils");

const seedDB = (articleData, commentsData, topicsData, userData) => {
  return mongoose.connection
    .dropDatabase()
    .then(() => {
      const topicsInsertion = Topic.insertMany(topicsData);
      const userInsertation = User.insertMany(userData);
      return Promise.all([topicsInsertion, userInsertation]);
    })
    .then(([topicsDocs, userDocs]) => {
      const userRefObj = createRefObj(userData, userDocs);
      const articleFormat = formatArticleData(
        articleData,
        userRefObj,
        topicsData
      );
      const articleInsertation = Article.insertMany(articleFormat);
      return Promise.all([articleInsertation, topicsDocs, userDocs]);
    })
    .then(([articleDocs, topicsDocs, userDocs]) => {
      const userRefObj = createRefObj(userData, userDocs);
      const articleRefObj = createArticleRefObj(articleData, articleDocs);
      const commentFormat = formatCommentData(
        commentsData,
        userRefObj,
        articleRefObj
      );
      const commentInsertation = Comment.insertMany(commentFormat);
      return Promise.all([
        commentInsertation,
        articleDocs,
        topicsDocs,
        userDocs
      ]);
    })
    .then(([commentDocs, articleDocs, topicsDocs, userDocs]) => {
      return [articleDocs[0], commentDocs[0], topicsDocs[0], userDocs[0]];
    });
};

module.exports = seedDB;
