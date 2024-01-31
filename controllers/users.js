const userRouter = require("express").Router();

userRouter.post("/register", (req, res, next) => {
  res.end("Lets register");
});

userRouter.post("/login", (req, res, next) => {
  res.end("Lets login");
});
module.exports = userRouter;
