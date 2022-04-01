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
const teacherAssignments_add = require("../middlewares/teacherAssignments_add");
const teacherAssignments_delete = require("../middlewares/teacherAssignment_delete");
const teacherAssignments_update = require("../middlewares/teacherAssignment_update");

const { assignmentMulter } = require("../assets/uploads");

const getTeacherAuth = require("../middlewares/teacherAuth");
const { Assignment } = require("../models/assignment");
getTeacherAuth();

router.post(
  "/assignment/:courseId",
  passport.authenticate("teacher-rule", { session: false }),
  teacherAssignments_add,
  assignmentMulter.array("assignments"),
  async (req, res) => {
    try {
      const assignment = new Assignment();
      assignment.teacherId = req.user._id;
      assignment.courseId = req.params.courseId;
      assignment.folderPath = req.folderPath;
      assignment.assignmentNumber = req.assignmentNumber;

      //Body Api Attributes
      assignment.links = req.body.links ? req.body.links : [];
      assignment.instructions = req.body.instructions
        ? req.body.instructions
        : [];
      assignment.startTime = req.body.startTime ? req.body.startTime : null;
      assignment.endTime = req.body.endTime ? req.body.endTime : null;

      const result = await assignment.save();

      return res.send(result);
    } catch (error) {
      res.send(error);
    }
  }
);

router.delete(
  "/assignment/:assignmentNo/:courseId",
  passport.authenticate("teacher-rule", { session: false }),
  teacherAssignments_delete,
  async (req, res) => {
    try {
      const result = await Assignment.findOneAndDelete({
        courseId: req.params.courseId,
        assignmentNumber: req.params.assignmentNo,
      });

      res.send(result);
    } catch (error) {
      res.send(error);
    }
  }
);

router.patch(
  "/assignment/:assignmentNo/:courseId",
  passport.authenticate("teacher-rule", { session: false }),
  teacherAssignments_update,
  assignmentMulter.array("assignments"),
  async (req, res) => {
    try {
      const assignment = await Assignment.findOne({
        courseId: req.params.courseId,
        assignmentNumber: req.params.assignmentNo,
      });

      //Body Api Attributes
      assignment.links = req.body.links ? req.body.links : [];
      assignment.instructions = req.body.instructions
        ? req.body.instructions
        : [];
      assignment.startTime = req.body.startTime ? req.body.startTime : null;
      assignment.endTime = req.body.endTime ? req.body.endTime : null;

      const result = await assignment.save();

      res.send(result);
    } catch (error) {
      res.send(error);
    }
  }
);

module.exports = router;
