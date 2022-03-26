const mongoose = require("mongoose");

const noteSchema = mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    refer: "Student",
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    refer: "Course",
    required: true,
  },

  files: { type: Array },

  visibilty: { type: Boolean, default: true, required: true },

  dateCreated: { type: Date, default: Date.now() },
});

const Note = mongoose.model("Note", noteSchema);

module.exports = { Note };
