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

      // let arr = [];
      // let allNotes = await req.allNotes;
      // let duplicates = [];

      // req.files.map((file) => {
      //   if (allNotes.includes(file.fullname)) {
      //     duplicates.push(file.name);
      //   } else {
      //     arr.push(file.fullname);
      //   }
      // });

      // if (arr.length < 1)
      //   return res
      //     .status(400)
      //     .send({ message: "no file to save, duplications were eliminated" });

      note.filesPath = req.file.fullPath;
      const result = await note.save();

      // if (duplicates.length > 0) {
      //   result.replacement_message = {
      //     values: duplicates,
      //     mistake: "Duplicate file name",
      //     action: "Replaced with previous duplicate files",
      //   };
      // }

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
    const file = req.body.path;
    const result = Note.find().select({ properties: 1 });
  }
);

module.exports = router;
