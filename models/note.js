const mongoose = require("mongoose");

mongoose.set("strictQuery", true);
const noteSchema = mongoose.Schema({
  content: String,
  important: Boolean,
});
module.exports = mongoose.model("Note", noteSchema);
