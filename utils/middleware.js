const logger = require("./logger");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const requestLogger = (req, res, next) => {
  logger.info("Method:", req.method);
  logger.info("Path:", req.path);
  logger.info("Body:", req.body);

  next();
};
const unknownEndpoint = (req, res, next) => {
  res.status(404).send({
    message: "UnknownEndPoint",
  });
  next();
};
const errorHandler = (error, req, res, next) => {
  logger.error("error is " + error.name);
  if (error.name === "CastError") {
    res.status(400).send({ message: "send proper id" });
  } else if (error.name === "MongooseError") {
    res.status(400).send({ message: "Cannot connect to database" });
  } else if (error.name === "ValidationError") {
    res.status(400).send({ message: "Duplicate entry not allowed" });
  }
  next(error);
};
const getTokenFrom = (req) => {
  const auth = req.get("authorization");
  if (auth && auth.startsWith("Bearer ")) {
    return auth.replace("Bearer ", "");
  }
  return null;
};
const tokenExtractor = async (req, res, next) => {
  const decodedToken = await jwt.verify(getTokenFrom(req), process.env.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ message: "Invalid token" });
  }
  const user = await User.findById(decodedToken.id);
  if (!user) {
    return res.status(400).json({ message: "User Not Found" });
  }
  req.user = user;
  next();
};
module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
};
