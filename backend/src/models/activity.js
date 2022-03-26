const mongoose = require("mongoose");

const activitySchema = mongoose.Schema({
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
  activityType: {
    type: String,
    enum: ["assignment", "quiz", "notes"],
    required: true,
  },

  quiz: {
    question: { type: String, required: true },
    questions: [],
    options: [
      {
        option: { type: String },
        img: { data: Buffer, contentType: String },
      },
    ],

    answers: { type: Array, required: true },
    startTime: { type: Date, default: Date.now() },
    endTime: { type: Date, default: Date.now() },
  },

  visibilty: { type: Boolean, default: true, required: true },

  dateCreated: { type: Date, default: Date.now() },
});

const Activity = mongoose.model("Activity", activitySchema);

module.exports = { Activity };
