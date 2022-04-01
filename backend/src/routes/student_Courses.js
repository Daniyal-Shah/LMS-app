const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
router.use(passport.initialize());

const getStudentAuth = require("../middlewares/studentAuth");
getStudentAuth();

const { Student, validate } = require("../models/student");
const { Course } = require("../models/course");

router.get("/test", async (req, res) => {
  return res.send("student test");
});

router.post(
  "/enroll/:courseId",
  passport.authenticate("student-rule", { session: false }),
  async (req, res) => {
    try {
      const { enrollmentCode } = req.body;
      if (
        enrollmentCode &&
        enrollmentCode.length >= 5 &&
        enrollmentCode.length <= 15
      ) {
        const course = await Course.findOne({
          enrollmentCode,
          _id: req.params.courseId,
        });

        if (!course) return res.status(401).send("No such course found");

        let alreadyEnrolled = false;
        course.enrolledStudents.map((i) => {
          if ("" + i.studentId == "" + req.user._id) {
            alreadyEnrolled = true;
          }
        });

        if (alreadyEnrolled) {
          return res
            .status(401)
            .send("You are already enrolled in this course");
        }

        const student = await Student.findById({ _id: req.user._id });

        course.enrolledStudents.push({
          studentId: req.user._id,
        });

        student.courses.push({ courseId: course._id });

        const result1 = await course.save();
        const result2 = await student.save();

        if (result1 && result2)
          return res.send(`You are enrolled in ${course.name} course`);

        res.status(400).send("Something went wrong");
      } else {
        res
          .status(401)
          .send("Enrollment code must be a string having length (5 to 15");
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

router.post(
  "/unenroll/:courseId",
  passport.authenticate("student-rule", { session: false }),
  async (req, res) => {
    try {
      const { enrollmentCode } = req.body;
      if (
        enrollmentCode &&
        enrollmentCode.length >= 5 &&
        enrollmentCode.length <= 15
      ) {
        const course = await Course.findOne({
          enrollmentCode,
          _id: req.params.courseId,
        });

        if (!course) return res.status(401).send("No such course found");

        let alreadyEnrolled = false;
        let index;

        course.enrolledStudents.map((i, ind) => {
          if ("" + i.studentId == "" + req.user._id) {
            alreadyEnrolled = true;
            index = ind;
          }
        });

        if (!alreadyEnrolled) {
          return res.status(401).send("You are not enrolled in this course");
        }

        course.enrolledStudents.splice(index, 1);

        const student = await Student.findById({ _id: req.user._id });

        student.courses.map((i, ind) => {
          if ("" + i.courseId == "" + req.params.courseId) {
            index = ind;
          }
        });

        student.courses.splice(index, 1);

        const result1 = await course.save();
        const result2 = await student.save();

        if (result1 && result2)
          return res.send(`You are unenrolled in ${course.name} course`);

        res.status(400).send("Something went wrong");
      } else {
        res
          .status(401)
          .send("Enrollment code must be a string having length (5 to 15");
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
);
module.exports = router;
