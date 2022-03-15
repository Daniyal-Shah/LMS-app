const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

//Collections
const { Teacher, validateTeacher } = require("../models/teacher");

const passport = require("passport");
router.use(passport.initialize());

require("../middlewares/teacherAuth");

router.post(
  "/test",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send(req.user);
  }
);

module.exports = router;
