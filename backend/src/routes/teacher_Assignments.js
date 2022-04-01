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
const { Assignment } = require("../models/assignment");
getTeacherAuth();

router.post(
  "/assignment/:courseId",
  passport.authenticate("teacher-rule", { session: false }),
  teacherAssignments,
  assignmentMulter.array("assignments"),
  async (req, res) => {
    const assignment = new Assignment();
    assignment.teacherId = req.user._id;
    assignment.courseId = req.params.courseId;
    assignment.folderPath = req.rootDirectory;
    const result = await assignment.save();

    return res.send(result);
  }
);

module.exports = router;
