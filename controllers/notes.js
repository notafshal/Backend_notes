const noteRouter = require("express").Router();
const Note = require("../models/note");
const User = require("../models/user");
const logger = require("../utils/logger");
noteRouter.get("/", (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes);
  });
});
noteRouter.get("/:id", (req, res, next) => {
  Note.findById(req.params.id)
    .then((note) => {
      if (note) {
        res.json(note);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});
noteRouter.post("/", async (req, res) => {
  const { content, important } = req.body;

  if (content === undefined) {
    res.status(400).json({ message: "Missing content" });
  }
  try {
    const body = req.body;
    const user = await User.findById(body.userId);
    const note = new Note({
      content: content,
      important: body.important === undefined ? false : body.important,
      user: user.id,
    });
    const savedNote = await note.save();
    user.notes = user.notes.concat(savedNote._id);
    await user.save();
    res.status(200).json({ user });
  } catch (error) {
    logger.error(error);
  }
});
module.exports = noteRouter;
