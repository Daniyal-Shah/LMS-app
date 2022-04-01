const fs = require("fs");
const { Course } = require("../models/course");

const { Assignment } = require("../models/assignment");

require("dotenv").config();

module.exports = async function (req, res, next) {
  const course = await Course.findOne({
    _id: req.params.courseId,
    teacherId: req.user.teacherId,
  });

  if (!req.params.assignmentNo)
    return res
      .status(400)
      .send({ message: "Assignment number and courseID are required" });

  req.assignmentNumber = req.params.assignmentNo;
  req.dir = course.name.replaceAll(" ", "_");
  req.rootDirectory = process.env.DIR_PATH + req.dir;
  req.folderPath =
    process.env.DIR_PATH + req.dir + "/assignment-" + req.assignmentNumber;

  fs.rmSync(req.folderPath, { recursive: true, force: true }, (err) => {
    if (err) {
      return console.log("error occurred in deleting directory", err);
    }
    console.log("Directory deleted successfully");
  });

  next();
};
