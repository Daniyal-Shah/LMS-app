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

  filesPath: { type: String },

  visibilty: { type: Boolean, default: true },

  dateCreated: { type: Date, default: Date.now() },
});

const Note = mongoose.model("Note", noteSchema);

module.exports = { Note };
