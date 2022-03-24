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
  visibilty: { type: Boolean, default: true, required: true },
  submissions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      refer: "Student",
    },
  ],
  dateCreated: { type: Date, default: Date.now() },
});

const Activity = mongoose.model("Activity", activitySchema);

module.exports = { Activity };
