const express = require("express");
const app = express();
const noteRouter = require("./controllers/notes");
const userRouter = require("./controllers/users");
const config = require("./utils/config");
const logger = require("./utils/logger");
const mongoose = require("mongoose");
const {
  requestLogger,
  unknownEndpoint,
  errorHandler,
} = require("./utils/middleware");
mongoose.set("strictQuery", true);
mongoose
  .connect(config.MONGO_URI)
  .then(() => logger.info("Connected to mongo"))
  .catch(() => logger.error("No connection to mongo"));
app.use(express.json());
app.use(requestLogger);

app.get("/", (req, res) => {
  res.end("Welcome to application");
});
app.use("/api/users", userRouter);
app.use("/api/notes", noteRouter);

app.use(errorHandler);
app.use(unknownEndpoint);
module.exports = app;
