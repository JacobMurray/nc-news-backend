const commentRouter = require("express").Router();
const { sendComment, updateVote, sendCommentById, deleteComment } = require("../controllers/comments");

commentRouter.route("/").get(sendComment);
commentRouter.route("/:comment_id").get(sendCommentById).patch(updateVote).delete(deleteComment);


module.exports = commentRouter;
