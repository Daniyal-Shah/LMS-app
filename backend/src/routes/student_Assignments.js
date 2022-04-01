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

const { studentAssignmentMulter } = require("../assets/uploads");
const studentAssignments_add = require("../middlewares/studentAssignment_add");

const getStudentAuth = require("../middlewares/studentAuth");
const { Assignment } = require("../models/assignment");
getStudentAuth();

router.post(
  "/assignment/:assignmentNo/upload/:courseId",
  passport.authenticate("student-rule", { session: false }),
  studentAssignments_add,
  studentAssignmentMulter.array("assignments"),

  async (req, res) => {
    const assignment = await Assignment.findOne({
      courseId: req.params.courseId,
      assignmentNo: req.params.assignmentNo,
    });

    if (!assignment) return res.status(401).send("Not found any assignment");

    if (!req.files)
      return res.status(400).send({ message: "Submission can not be empty" });

    let allFiles = [];

    req.files.map((i) => {
      allFiles.push("" + i.path);
    });

    assignment.submissions.push({
      studentId: req.user._id,
      submitFiles: allFiles,
    });

    const result = await assignment.save();

    res.send(result);
  }
);

module.exports = router;
