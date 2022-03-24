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

router.post("/register", async (req, res) => {
  try {
    const { error } = validateTeacher(req.body);
    if (error) return res.status(400).send(error.details);

    let teacher = await Teacher.findOne({ email: req.body.email });
    if (teacher) return res.status(400).send("You are already signed up");

    let lastTeacher = await Teacher.find({}).limit(1).sort({ $natural: -1 });
    if (lastTeacher.length > 0 && teacher) {
      let lastTeacherId = lastTeacher[0].teacherId.split("-")[1];
      teacher.teacherId = "INS-" + parseInt(lastTeacherId) + 1;
    } else if (lastTeacher.length > 0 && !teacher) {
      teacher = Teacher(req.body);
      let lastTeacherId = lastTeacher[0].teacherId.split("-")[1];
      teacher.teacherId = "INS-" + (parseInt(lastTeacherId) + 1);
    } else {
      teacher = Teacher(req.body);
      teacher.teacherId = "INS-1";
    }

    teacher.password = await bcrypt.hash(teacher.password, 10);
    const result = await teacher.save();
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    // Get user input
    const { email, password, teacherId } = req.body;

    if (email) {
      // Validate user input
      if (!(email && password)) {
        res.status(400).send("All inputs are required");
      }
      // Validate if user exist in our database
      let teacher = await Teacher.findOne({ email });

      if (teacher && (await bcrypt.compare(password, teacher.password))) {
        const token = teacher.generateAuthToken();

        res.status(201).send({
          success: true,
          token: "Bearer " + token,
          message: "User Logged In Successfully",
        });
      } else {
        res.status(400).send("Invalid Credentials");
      }
    }

    if (teacherId) {
      // Validate user input
      if (!(teacherId && password)) {
        res.status(400).send("All inputs are required");
      }
      // Validate if user exist in our database
      let teacher = await Teacher.findOne({ teacherId });

      if (teacher && (await bcrypt.compare(password, teacher.password))) {
        const token = teacher.generateAuthToken();

        res.status(201).send({
          success: true,
          token: "Bearer " + token,
          message: "User Logged In Successfully",
        });
      } else {
        res.status(400).send("Invalid Credentials");
      }
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

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

router.post(
  "/activity/:courseId",
  passport.authenticate("teacher-rule", { session: false }),
  async (req, res) => {
    try {
      const courses = await Course.findOne({
        teacherId: req.user.teacherId,
        courseId: req.params.courseId,
      });

      if (!courses)
        return res.status(400).send("You don't have any such course");

      let activity = new Activity();
      activity.teacherId = req.user._id;
      activity.activityType = req.body.type;
      activity.courseId = req.params.courseId;

      const result = await activity.save();
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send("Something went wrong");
    }
  }
);

router.get(
  "/activity/:_id",
  passport.authenticate("teacher-rule", { session: false }),
  async (req, res) => {
    try {
      const activity = await Activity.findById({ _id: req.params._id });

      if (!activity) return res.status(400).send("Not found any activity");

      res.status(200).send(activity);
    } catch (error) {
      res.status(500).send("Something went wrong");
    }
  }
);

router.get(
  "/activity/:courseId",
  passport.authenticate("teacher-rule", { session: false }),
  async (req, res) => {
    try {
      const activities = await Activity.find({
        courseId: req.params.courseId,
      });

      if (!activities)
        return res.status(400).send("You don't have any such course");

      res.status(200).send(activities);
    } catch (error) {
      res.status(500).send("Something went wrong");
    }
  }
);
module.exports = router;
