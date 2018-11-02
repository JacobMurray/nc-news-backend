const { Comment } = require("../models");

exports.sendComment = (req, res, next) => {
  Comment.find()
    .then(comment => {
      if (comment.length === 0)
        return Promise.reject({
          status: 404,
          message: "That comment doesnt exist"
        });
      res.send({ comment });
    })
    .catch(err => {
      next(err);
    });
};

exports.sendCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  Comment.find({ _id: comment_id })
    .populate("belongs_to")
    .populate("created_by")
    .then(comment => {
      if (comment.length === 0)
        return Promise.reject({
          status: 404,
          message: "That comment doesnt exist"
        });
      res.send({ comment });
    })
    .catch(err => {
      next(err);
    });
};

exports.updateVote = (req, res, next) => {
  const { comment_id } = req.params;
  const { vote } = req.query;
  let inc = 0;
  if (vote === "up") inc = 1;
  else if (vote === "down") inc = -1;
  Comment.findOneAndUpdate(
    { _id: comment_id },
    { $inc: { votes: inc } },
    { new: true }
  )
    .populate("belongs_to")
    .populate("created_by")
    .then(comment => {
      if(comment === null) return Promise.reject({status: 404, message: "That comment doesnt exist"})
      res.status(200).send({comment});
    })

    .catch(err => {
      next(err);
    });
};

exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params;
    Comment.remove({ _id: comment_id })
    .then((comment) => {
      if(comment.length === 0) return Promise.reject({status: 404, message: "That comment doesnt exist"})
        res.send({message: 'comment removed'})
    })
    .catch(err => {
        next(err)
    })
}