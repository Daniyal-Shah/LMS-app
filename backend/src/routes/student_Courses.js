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
          if (i.studentId === req.user.studentId) {
            alreadyEnrolled = true;
          }
        });

        if (alreadyEnrolled)
          return res
            .status(401)
            .send("You are already enrolled in this course");

        course.enrolledStudents.push({
          studentId: req.user.studentId,

          enrolledDate: Date.now(),
        });

        const student = await Student.findById({ _id: req.user._id });
        student.courses.push([course._id, course.name]);

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

module.exports = router;
