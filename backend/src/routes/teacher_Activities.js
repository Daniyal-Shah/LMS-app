const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const multer = require("multer");
router.use(passport.initialize());

//Collections
const { Teacher, validateTeacher } = require("../models/teacher");
const { Course, validateCourse } = require("../models/course");
const { Quiz } = require("../models/quiz");

const getTeacherAuth = require("../middlewares/teacherAuth");
getTeacherAuth();

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../../uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

var upload = multer({ storage: storage });

router.get("/testActivity", async (req, res) => {
  res.sendFile("/index.html");
});

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

// router.get(
//   "/activity/:_id",
//   passport.authenticate("teacher-rule", { session: false }),
//   async (req, res) => {
//     try {
//       const activity = await Activity.findById({ _id: req.params._id });

//       if (!activity) return res.status(400).send("Not found any activity");

//       res.status(200).send(activity);
//     } catch (error) {
//       res.status(500).send("Something went wrong");
//     }
//   }
// );

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
