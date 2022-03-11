const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Teacher, validate } = require("../models/teacher");

router.post("/register", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) res.status(400).send(error.details);

    let teacher = await Teacher.findOne({ email: req.body.email });
    if (teacher) return res.status(400).send("You are already signed up");
    teacher = new Teacher(req.body);
    teacher.password = await bcrypt.hash(teacher.password, 10);
    teacher.token = teacher.generateAuthToken();
    await teacher.save();
    res.send(teacher);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    res.status(201).send("Login user");
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
