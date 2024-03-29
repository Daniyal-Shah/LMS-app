const multer = require("multer");
const fs = require("fs");
const { Course } = require("../models/course");
const { Note } = require("../models/note");

require("dotenv").config();

module.exports = async function (req, res, next) {
  const course = await Course.findOne({
    _id: req.params.courseId,
    teacherId: req.user.teacherId,
  });

  if (!course) return res.status(401).send("You can't access to this course");

  req.dir = course.name.replaceAll(" ", "_");
  req.rootDirectory = process.env.DIR_PATH + req.dir;

  if (!fs.existsSync("./src/assets/notes/" + req.dir)) {
    fs.mkdirSync(`./src/assets/notes/${req.dir}`);
  }
  next();
};
