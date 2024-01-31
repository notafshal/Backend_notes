const userRouter = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

userRouter.get("/", async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

userRouter.post("/register", async (req, res, next) => {
  const { username, name, password } = req.body;
  //validate if any content is missing
  if (username === undefined || name === undefined || password === undefined) {
    return res.status(400).json({ message: "missing username or pass" });
  }
  //pasword hash
  const saltRounds = 11;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const user = new User({
    username,
    name,
    passwordHash,
  });
  user
    .save()
    .then((user) => res.json(user))
    .catch((err) => next(err));
});

userRouter.post("/login", (req, res, next) => {
  res.end("Lets login");
});
module.exports = userRouter;
