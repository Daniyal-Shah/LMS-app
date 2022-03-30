const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const fs = require("fs");

router.use(passport.initialize());
require("dotenv").config();

//Collections
const { Course, validateCourse } = require("../models/course");
const { Quiz } = require("../models/quiz");

const getTeacherAuth = require("../middlewares/teacherAuth");
getTeacherAuth();

router.post(
  "/quiz/:courseId",
  passport.authenticate("teacher-rule", { session: false }),

  async (req, res) => {
    try {
      const course = await Course.findOne({
        teacherId: req.user.teacherId,
        courseId: req.params.courseId,
      });

      if (!course)
        return res.status(400).send("You don't have any such course");

      let quiz = new Quiz();

      quiz.teacherId = req.user._id;
      quiz.activityType = req.body.type;
      quiz.courseId = req.params.courseId;
      quiz.questions = req.body.questions;

      const result = await quiz.save();

      res.status(200).send(result);
    } catch (error) {
      res.status(500).send("Something went wrong");
    }
  }
);

router.get(
  "/quiz/:courseId",
  passport.authenticate("teacher-rule", { session: false }),
  async (req, res) => {
    try {
      const quizzes = await Quiz.find({
        courseId: req.params.courseId,
      });

      if (!quizzes)
        return res.status(400).send("You don't have any such course");

      res.status(200).send(quizzes);
    } catch (error) {
      res.status(500).send("Something went wrong");
    }
  }
);

module.exports = router;
