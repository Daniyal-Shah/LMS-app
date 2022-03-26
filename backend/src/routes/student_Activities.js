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
const Quiz = require("../models/quiz");

router.get("/testStudent", async (req, res) => {
  res.send("pass student test");
});

router.get(
  "/quiz/:quizId",
  // passport.authenticate("student-rule", { session: false }),
  async (req, res) => {
    const quiz = await Quiz.find({ _id: req.params.quizId });
    // const course = await Course.findById({ _id: quiz.courseId });

    res.send(quiz);
  }
);

module.exports = router;
