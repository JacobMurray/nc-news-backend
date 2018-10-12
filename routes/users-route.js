const userRouter = require("express").Router();
const { sendUser, sendUserById} = require("../controllers/user");

userRouter.get('/', sendUser);
userRouter.get('/:user_id',sendUserById)


module.exports = userRouter;