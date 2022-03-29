const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const fs = require("fs");

router.use(passport.initialize());
require("dotenv").config();

//Collections
const { Teacher, validateTeacher } = require("../models/teacher");
const { Course, validateCourse } = require("../models/course");
const { Quiz } = require("../models/quiz");
const { Note } = require("../models/note");

const getTeacherAuth = require("../middlewares/teacherAuth");
getTeacherAuth();

const { notesMulter } = require("../assets/uploads");
const teacherNotes = require("../middlewares/teacherNotes");

//Upload notes
router.post(
  "/notes/:courseId",
  passport.authenticate("teacher-rule", { session: false }),
  teacherNotes,
  notesMulter.array("notes"),
  async (req, res) => {
    try {
      const note = new Note();
      note.teacherId = req.user._id;
      note.courseId = req.params.courseId;

      let arr = [];
      let allNotes = await req.allNotes;
      let duplicates = [];

      req.files.map((file) => {
        if (allNotes.includes(file.fullname)) {
          duplicates.push(file.name);
        } else {
          arr.push(file.fullname);
        }
      });

      if (arr.length < 1)
        return res
          .status(400)
          .send({ message: "no file to save, duplications were eliminated" });

      note.filesPath = arr;
      const result = await note.save();

      if (duplicates.length > 0) {
        result.replacement_message = {
          values: duplicates,
          mistake: "Duplicate file name",
          action: "Replaced with previous duplicate files",
        };
      }

      res.status(200).send(result);
    } catch (error) {
      // if (error.code && error.code == 11000) {
      //   return res
      //     .status(400)
      //     .send({ message: "Some file are duplicate,kindly change name" });
      // }
      res.status(500).send(error);
    }
  }
);

//Get All notes links
router.get(
  "/notes/:courseId",
  passport.authenticate("teacher-rule", { session: false }),
  teacherNotes,
  async (req, res) => {
    let allNotes = req.allNotes;
    let allNames = req.allNames;

    res.send({ allNotes, allNames });
  }
);

//Get specific note by teacher
router.get(
  "/notes/download/:courseId",
  passport.authenticate("teacher-rule", { session: false }),
  teacherNotes,
  async (req, res) => {
    res.download(req.rootDirectory + "/" + req.body.file, function (error) {
      if (error.status && error.status == 404)
        return res.status(404).send({ message: "No such file found" });
      res.status(404).send({ message: "Something went wrong" });
    });
  }
);

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
