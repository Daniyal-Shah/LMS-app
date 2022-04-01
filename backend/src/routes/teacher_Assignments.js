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
const teacherAssignments = require("../middlewares/teacherAssignments");

const { assignmentMulter } = require("../assets/uploads");

const getTeacherAuth = require("../middlewares/teacherAuth");
getTeacherAuth();

router.post(
  "/assignment/:courseId",
  passport.authenticate("teacher-rule", { session: false }),
  teacherAssignments,
  //   assignmentMulter.array("notes"),
  async (req, res) => {
    return res.send("pass");
  }
);

module.exports = router;
