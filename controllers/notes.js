const noteRouter = require("express").Router();
const Note = require("../models/note");
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
noteRouter.post("/", (req, res) => {
  const { content, important } = req.body;
  if (content === undefined) {
    res.status(400).json({ message: "Missing content" });
  }
  const note = new Note({
    content: content,
    important: important || false,
  });
  note.save().then((note) => {
    res.end();
  });
});
module.exports = noteRouter;
