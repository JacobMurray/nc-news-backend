const { User } = require("../models");

exports.sendUser = (req, res, next) => {
  User.find().then(users => {
    res.send({ users });
  });
};

exports.sendUserById = (req, res, next) => {
    const {user_id} = req.params
    User.find({username: user_id}).then(user => {
      if(user.length === 0) return Promise.reject({status: 404, message: "That user doesnt exist"})
      res.send({ user });
    }).catch(err => {
        next(err)
    })
  };