const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
router.use(passport.initialize());

//Collections
const { Teacher, validateTeacher } = require("../models/teacher");
const { Course, validateCourse } = require("../models/course");

const getTeacherAuth = require("../middlewares/teacherAuth");
getTeacherAuth();

router.get("/testLogin", async (req, res) => {
  res.send("login Passed");
});

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

module.exports = router;
