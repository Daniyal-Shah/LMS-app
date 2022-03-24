const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
router.use(passport.initialize());

//Collections
const { Teacher, validateTeacher } = require("../models/teacher");
const { Course, validateCourse } = require("../models/course");
const { Activity } = require("../models/activity");

const getTeacherAuth = require("../middlewares/teacherAuth");
getTeacherAuth();

router.get(
  "/courses",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const courses = await Course.find({ teacherId: req.user.teacherId });
      if (!courses)
        return res.status(401).send("No courses are created by this teacher");

      res.status(201).send(courses);
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

router.get(
  "/courses/:courseId",
  passport.authenticate("teacher-rule", { session: false }),
  async (req, res) => {
    try {
      const courses = await Course.findOne({
        teacherId: req.user.teacherId,
        _id: req.params.courseId,
      });
      if (!courses) return res.status(401).send("No such course");

      res.status(201).send(courses);
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

router.post(
  "/test",
  passport.authenticate("teacher-rule", { session: false }),
  async (req, res) => {
    return res.send(req.user);
  }
);

router.post(
  "/add_course",
  passport.authenticate("teacher-rule", { session: false }),
  async (req, res) => {
    try {
      const obj = { ...req.body };
      obj.teacherId = req.user.teacherId;
      obj.department = req.user.department;

      const { error } = validateCourse(obj);
      if (error) return res.status(400).send(error.details);

      let course = await Course.findOne({
        enrollmentCode: obj.enrollmentCode,
      });

      if (course) return res.status(400).send("Try different enrollment code");
      course = new Course(obj);
      // course.enrollmentCode = await bcrypt.hash(course.enrollmentCode, 10);
      const result = await course.save();
      res.status(201).send(result);
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

router.delete(
  "/courses/:courseId",
  passport.authenticate("teacher-rule", { session: false }),
  async (req, res) => {
    try {
      const courseId = req.params.courseId;
      const teacherId = req.user.teacherId;

      if (courseId && teacherId) {
        const foundCourse = await Course.findOne({
          _id: courseId,
        });

        if (!foundCourse) return res.status(404).send("No such course");

        if (foundCourse && foundCourse.teacherId !== teacherId)
          return res.status(404).send("You are not teacher of this course");

        const result = await Course.findByIdAndDelete({
          _id: courseId,
          teacherId,
        });
        res.status(200).send(result);
      } else {
        res.status(401).send("Both teacher and course id's are required");
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

router.put(
  "/courses/:courseId",
  passport.authenticate("teacher-rule", { session: false }),
  async (req, res) => {
    try {
      console.log(req.params.courseId);
      console.log(req.user.teacherId);

      const foundCourse = await Course.findById({ _id: req.params.courseId });
      if (!foundCourse) return res.status(401).send("Somwthing went wrong");

      if (foundCourse.teacherId !== req.user.teacherId)
        return res.status(401).send("You are not teacher of this course");

      const updated = await Course.findByIdAndUpdate(
        { _id: req.params.courseId },
        req.body,
        { new: true }
      );
      res.status(201).send(updated);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

module.exports = router;
