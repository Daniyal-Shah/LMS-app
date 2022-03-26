const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
router.use(passport.initialize());

const getStudentAuth = require("../middlewares/studentAuth");
getStudentAuth();

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
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/login", async (req, res) => {
  // Get user input

  const { email, password, studentId } = req.body;

  try {
    let student = await Student.findOne({ email });
    if (!student) return res.status(401).send("Not found such user");

    if (email) {
      if (!(email && password))
        return res.status(400).send("All inputs are required");

      let student = await Student.findOne({ email });
      if (!student) return res.status(401).send("Not found such user");

      if (await bcrypt.compare(password, student.password)) {
        const token = student.generateAuthToken();
        return res.status(201).send({
          success: true,
          token: "Bearer " + token,
          message: "User Logged In Successfully",
        });
      } else {
        return res.status(400).send("Something went wrong");
      }
    }

    if (!email && studentId) {
      if (!(studentId && password))
        return res.status(400).send("All inputs are required");

      let student = await Student.findOne({ email });
      if (!student) return res.status(401).send("Not found such user");

      if (await bcrypt.compare(password, student.password)) {
        const token = student.generateAuthToken();
        return res.status(201).send({
          success: true,
          token: "Bearer " + token,
          message: "User Logged In Successfully",
        });
      } else {
        return res.status(400).send("Something went wrong");
      }
    }
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;
