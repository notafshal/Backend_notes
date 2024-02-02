const userRouter = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

userRouter.get("/", async (req, res) => {
  const users = await User.find({}).populate("notes", {
    content: 1,
    important: 1,
  });
  res.json(users);
});

userRouter.post("/register", async (req, res, next) => {
  const { username, name, password } = req.body;
  //validate if any content is missing
  if (username === undefined || name === undefined || password === undefined) {
    return res.status(401).json({ message: "missing credentials" });
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

userRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  if (username === undefined || password === undefined) {
    return res.status(401).json({ message: "missing username or password" });
  }
  const user = await User.findOne({ username: username });
  if (user) {
    const samePassword = await bcrypt.compare(password, user.passwordHash);
    if (samePassword) {
      const userToken = {
        username: user.username,
        id: user._id,
      };
      const signedToken = await jwt.sign(userToken, process.env.SECRET);
      console.log(signedToken);
      return res
        .status(200)
        .json({ username: user.username, token: signedToken });
    }
    res.status(401).json({ message: "Incorrect username or password" });
  }
  return res.status(401).json({ message: "Incorrect username or password" });
});
module.exports = userRouter;
