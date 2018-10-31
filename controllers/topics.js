const { Topic, Article, User } = require("../models");

exports.sendTopics = (req, res, next) => {
  Topic.find().then(topic => {
    res.send({ topic });
  });
};

exports.sendArticleByTopic = (req, res, next) => {
  const { topics_slug } = req.params;
  Article.find({ belongs_to: topics_slug })
    .populate("created_by", "-__v -_id")
    .then(article => {
      if(article.length === 0) return Promise.reject({status: 404, message: "That topic doesnt exist"})
      res.send({ article });
    }).catch(err => {
      next(err)
    })
};

exports.postArticle = (req, res, next) => {
  const { topics_slug } = req.params;
  const { title, body, created_by } = req.body;
    Article.create({
        title,
        body,
        belongs_to: topics_slug,
        created_by: created_by
      })
    .then(article => {
      return Article.find({ title: article.title }).populate(
        "created_by",
        "-__v -_id"
      );
    })
    .then(article => {
      res.status(201).send({article : article[0]});
    })
    .catch(err =>{
      if(err.name === 'ValidationError') err.status = 400;
      next(err)
    });
};
