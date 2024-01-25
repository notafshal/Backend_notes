const logger = require("./logger");

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
  }
  next(error);
};
module.exports = { requestLogger, unknownEndpoint, errorHandler };
