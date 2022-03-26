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
        });

        if (!course) return res.status(401).send("No such course found");

        course.enrolledStudents.push({
          studentId: req.user.studentId,
          submissions: [],
          enrolledDate: Date.now(),
        });

        const student = await Student.findById({ _id: req.user._id });
        student.courses.push([course._id, course.name]);

        const result1 = await course.save();
        const result2 = await student.save();

        res.send([result1, result2]);
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
