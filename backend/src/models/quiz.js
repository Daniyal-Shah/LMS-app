const mongoose = require("mongoose");

const quizSchema = mongoose.Schema({
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
  questions: [
    {
      question: { type: String, required: true },
      options: [
        {
          option: { type: String },
          img: { data: Buffer, contentType: String },
          value: { type: Boolean },
        },
      ],
    },
  ],

  submissions: [
    {
      studentId: { type: mongoose.Schema.Types.ObjectId, refer: "Student" },
      submitAnswers: { type: Array, required: true },
      submissionDate: { type: Date, default: Date.now() },
    },
  ],

  startTime: { type: Date, default: Date.now() },

  endTime: { type: Date, default: Date.now() },

  visibilty: { type: Boolean, default: true, required: true },

  dateCreated: { type: Date, default: Date.now() },
});

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = { Quiz };
