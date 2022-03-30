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
  notesMulter.single("notes"),
  async (req, res) => {
    try {
      const note = new Note();
      note.teacherId = req.user._id;
      note.courseId = req.params.courseId;

      note.filesPath = req.file.fullPath;
      const result = await note.save();

      res.status(200).send(result);
    } catch (error) {
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
    try {
      const notes = await Note.find();

      res.send(notes);
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

//Download specific note by teacher
router.get(
  "/notes/download/:courseId",
  passport.authenticate("teacher-rule", { session: false }),
  teacherNotes,
  async (req, res) => {
    res.download(req.rootDirectory + "/" + req.body.file, function (error) {
      if (error) {
        console.log({ message: "Something went wrong" });
      }
    });
  }
);

//Delete specific note
router.delete(
  "/notes/:courseId",
  passport.authenticate("teacher-rule", { session: false }),
  teacherNotes,
  async (req, res) => {
    const file = req.body.file;
    const result = Note.findOneAndDelete({ filesPath: file });
    res.send(result);
  }
);

module.exports = router;
