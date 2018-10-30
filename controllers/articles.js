const { Article, Comment, User } = require("../models");

exports.sendArticles = (req, res, next) => {
  Article.find().populate('created_by')
  .then(article => {
    res.send({ article });
  });
};

exports.sendArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  Article.find({ _id: article_id }).populate('created_by')
  .then(article => {
    if(article.length === 0) return Promise.reject({status: 404, message: "That article doesnt exist"})
    res.send({ article });
  })
  .catch(err => {
    next(err)
  })
};

exports.sendCommentsById = (req, res, next) => {
  const { article_id } = req.params;
  Article.find({ _id: article_id })
    .then(article => {
      if(article.length === 0) return Promise.reject({status: 404, message: "That article doesnt exist"})
      return Comment.find({ belongs_to: article[0]._id })
      .populate('belongs_to')
      .populate('created_by')
    })
    .then(comments => {
      res.send({ comments });
    })
    .catch(err => {
      next(err)
    })
};

exports.postComment = (req, res, next) => {
  const { body, created_by } = req.body;
  const { article_id } = req.params;
  Promise.all([Article.find({ _id: article_id }), User.find()])
  .then(
    ([article, users]) => {
      if(article.length === 0) return Promise.reject({status: 404, message: "That article doesnt exist"})
      //const user = users.find(element => element.username === created_by)._id;
      return Comment.create({
        body,
        created_by: created_by,
        belongs_to: article_id
      });
    }
  )
  .then(comment => {
      return Comment.find({_id: comment._id
    })
      .populate('belongs_to')
      .populate('created_by')
  })
  .then(comment => {
      res.status(201).send({comment})
  })
  .catch(err => {
    next(err)
  })
};

exports.updateVote = (req, res, next) => {
  const { article_id } = req.params;
  const { vote } = req.query;
  let inc = 0;
  if (vote === "up") inc = 1;
  else if (vote === "down") inc = -1;
  Article.findOneAndUpdate(
    { _id: article_id },
    { $inc: { votes: inc } },
    { new: true }
  )
    .populate("created_by")
    .then(article => {
      if(article === null) return Promise.reject({status: 404, message: "That article doesnt exist"})
      res.status(200).send({article});
    })

    .catch(err => {
      next(err);
    });
};


