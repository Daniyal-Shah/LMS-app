const multer = require("multer");
const fs = require("fs");
const { Course } = require("../models/course");

const { Assignment } = require("../models/assignment");

require("dotenv").config();

module.exports = async function (req, res, next) {
  const course = await Course.findOne({
    _id: req.params.courseId,
  });

  if (!course) return res.status(401).send("No such course found");
  let enrollment = false;

  course.enrolledStudents.map((item) => {
    if (item.studentId == req.user.studentId) {
      enrollment = true;
    }
  });

  if (!enrollment)
    return res.status(401).send("You are not enrolled in this course");

  req.assignmentNumber = req.params.assignmentNo;

  req.dir = course.name.replaceAll(" ", "_");
  req.rootDirectory = process.env.DIR_PATH + req.dir;
  req.folderPath =
    process.env.DIR_PATH + req.dir + "/assignment-" + req.assignmentNumber;

  if (!fs.existsSync(req.folderPath + "/" + req.user.studentId)) {
    fs.mkdirSync(req.folderPath + "/" + req.user.studentId);
  }
  next();
};
