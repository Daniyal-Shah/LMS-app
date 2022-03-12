const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const { Teacher, validate } = require("../models/teacher");
const passport = require("passport");
router.use(passport.initialize());

require("../middlewares/teacherAuth");

router.post("/register", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) res.status(400).send(error.details);

    let teacher = await Teacher.findOne({ email: req.body.email });
    if (teacher) return res.status(400).send("You are already signed up");
    teacher = new Teacher(req.body);
    teacher.password = await bcrypt.hash(teacher.password, 10);
    // teacher.token = teacher.generateAuthToken();
    await teacher.save();
    res.send(teacher);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

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
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get(
  "/add_Course",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.status(201).send(req.user);
  }
);

module.exports = router;
