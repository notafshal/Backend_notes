const mongoose = require("mongoose");

const noteSchema = mongoose.Schema({
  content: String,
  important: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
noteSchema.set("toJSON", {
  transfor: (document, returnedObject) => {
    returnedObject._id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject._v;
  },
});
module.exports = mongoose.model("Note", noteSchema);
