const multer = require("multer");
const fs = require("fs");
const { Course } = require("../models/course");

const { Assignment } = require("../models/assignment");

require("dotenv").config();

module.exports = async function (req, res, next) {
  const course = await Course.findOne({
    _id: req.params.courseId,
    teacherId: req.user.teacherId,
  });

  const assignments = await Assignment.find({ courseId: req.params.courseId });

  if (!course) return res.status(401).send("You can't access to this course");

  req.dir = course.name.replaceAll(" ", "_");
  req.assignmentNumber = assignments.length + 1;

  req.rootDirectory =
    process.env.DIR_PATH + req.dir + "/assignment-" + req.assignmentNumber;

  if (
    !fs.existsSync(
      "./src/assets/notes/" + req.dir + "/assignment-" + req.assignmentNumber
    )
  ) {
    fs.mkdirSync(
      `./src/assets/notes/${req.dir}/assignment-${req.assignmentNumber}`
    );
  }
  next();
};
