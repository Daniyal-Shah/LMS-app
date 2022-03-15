const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const passport = require("passport");
router.use(passport.initialize());

require("../middlewares/studentAuth");

const { Student, validate } = require("../models/student");
const { Course } = require("../models/course");

const makeStudentId = (student, lastStudentId) => {
  return `${student.department}-${student.batch}-${
    parseInt(lastStudentId) + 1
  }`;
};

router.post("/register", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details);

    let student = await Student.findOne({ email: req.body.email });
    if (student) return res.status(400).send("Already registered");

    student = Student(req.body);
    student.password = await bcrypt.hash(student.password, 10);

    let lastStudent = await Student.find({}).limit(1).sort({ $natural: -1 });
    if (lastStudent.length > 0 && student) {
      let lastStudentId = lastStudent[0].studentId.split("-")[2];
      student.studentId = makeStudentId(student, lastStudentId);
    } else if (lastStudent.length > 0 && !student) {
      student = Student(req.body);
      let lastStudentId = lastStudent[0].studentId.split("-")[1];
      student.studentId = makeStudentId(student, lastStudentId);
    } else {
      student = Student(req.body);
      student.studentId = makeStudentId(student, 0);
    }

    student.password = await bcrypt.hash(student.password, 10);
    const result = await student.save();
    res.status(201).send(result);
  } catch (error) {}
  res.status(500).send(error);
});

router.post("/login", async (req, res) => {
  try {
    // Get user input
    const { email, password, studentId } = req.body;

    if (email) {
      // Validate user input
      if (!(email && password)) {
        res.status(400).send("All inputs are required");
      }
      // Validate if user exist in our database
      let student = await Student.findOne({ email });
      console.log(student);
      if (!student) return res.status(401).send("Not found such user");

      if (student && (await bcrypt.compare(password, student.password))) {
        const token = student.generateAuthToken();

        res.status(201).send({
          success: true,
          token: "Bearer " + token,
          message: "User Logged In Successfully",
        });
      } else {
        res.status(400).send("Something went wrong");
      }
    }

    if (studentId) {
      // Validate user input
      if (!(studentId && password)) {
        res.status(400).send("All inputs are required");
      }
      // Validate if user exist in our database
      let student = await Student.findOne({ studentId });
      if (!student) return res.status(401).send("Not found such user");

      if (student && (await bcrypt.compare(password, student.password))) {
        const token = teacher.generateAuthToken();

        res.status(201).send({
          success: true,
          token: "Bearer " + token,
          message: "User Logged In Successfully",
        });
      } else {
        res.status(400).send("Something went wrong");
      }
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post(
  "/enroll/:courseId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { enrollmentCode } = req.body;
      if (
        enrollmentCode &&
        enrollmentCode.length >= 5 &&
        enrollmentCode.length <= 15
      ) {
        const course = await Course.findOne({
          enrollmentCode: req.body.enrollmentCode,
        });

        if (!course) return res.status(401).send("No such course found");

        course.enrolledStudents.push({
          studentId: req.user.studentId,
          submissions: [],
          enrolledDate: Date.now(),
        });

        const student = await Student.findById({ _id: req.user._id });
        student.courses.push(course._id);

        const result1 = await course.save();
        const result2 = await student.save();

        res.send([course, student]);
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
