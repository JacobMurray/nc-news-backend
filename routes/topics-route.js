const topicsRouter = require("express").Router();
const {
  sendTopics,
  sendArticleByTopic,
  postArticle
} = require("../controllers/topics");

topicsRouter.get("/", sendTopics);
topicsRouter
  .route("/:topics_slug/articles")
  .get(sendArticleByTopic)
  .post(postArticle);

module.exports = topicsRouter;
