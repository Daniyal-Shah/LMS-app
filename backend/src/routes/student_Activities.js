const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
router.use(passport.initialize());

const getStudentAuth = require("../middlewares/studentAuth");
getStudentAuth();

const { Student, validate } = require("../models/student");
const { Course } = require("../models/course");
const Note = require("../models/note");
const Assignment = require("../models/assignment");
const { Quiz } = require("../models/quiz");

router.get("/testStudent", async (req, res) => {
  res.send("pass student test");
});

router.post(
  "/quiz/:quizId",
  passport.authenticate("student-rule", { session: false }),
  async (req, res) => {
    const quiz = await Quiz.findOne({ _id: req.params.quizId });
    if (!quiz) return res.status(400).send("No such quiz found");

    const course = await Course.findOne({ _id: quiz.courseId });

    let enrollment = false;

    course.enrolledStudents.map((i) => {
      if (i === req.user._id) {
        enrollment = true;
      }
    });

    if (!enrollment)
      return res.status(400).send("You are not enrolled in this course");

    res.send(enrollment);
  }
);

module.exports = router;
