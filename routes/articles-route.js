const articleRouter = require("express").Router();
const {
  sendArticles,
  sendArticlesById,
  sendCommentsById,
  postComment,
  updateVote
} = require("../controllers/articles");

articleRouter.get("/", sendArticles);
articleRouter.route("/:article_id").get(sendArticlesById).patch(updateVote);
articleRouter
  .route("/:article_id/comments")
  .get(sendCommentsById)
  .post(postComment);

module.exports = articleRouter;
