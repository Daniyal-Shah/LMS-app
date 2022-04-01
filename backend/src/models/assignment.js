const mongoose = require("mongoose");

const assignmentSchema = mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    refer: "Teacher",
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    refer: "Course",
    required: true,
  },

  assignmentNumber: { type: String, required: true, unique: true },

  folderPath: { type: String, required: true, unique: true },

  instructions: [{ type: String }],
  links: [{ type: String }],

  submissions: [
    {
      studentId: { type: mongoose.Schema.Types.ObjectId, refer: "Student" },
      submitFiles: [{ type: String }],
      submissionDate: { type: Date, default: Date.now() },
    },
  ],

  startTime: { type: Date, default: Date.now() },
  endTime: { type: Date, default: Date.now() },
  visibilty: { type: Boolean, default: true },
  dateCreated: { type: Date, default: Date.now() },
});

const Assignment = mongoose.model("Assignment", assignmentSchema);

module.exports = { Assignment };
