const multer = require("multer");
const fs = require("fs");
const { Course } = require("../models/course");

const createDir = async (dir) => {
  fs.existsSync(dir, (exists) => {
    if (!exists) {
      console.log(exists);
      fs.mkdirSync(`./src/assets/notes/${dir}`, (err) => {
        if (err) {
          throw err;
        }
        console.log("Directory is created.");
      });
    } else {
      console.log("already created directory");
    }
  });
};

module.exports = async function (req, res, next) {
  const course = await Course.findOne({ _id: req.params.courseId });
  req.dir = course.name.replaceAll(" ", "_");

  if (!fs.existsSync("./src/assets/notes/" + req.dir)) {
    fs.mkdirSync(`./src/assets/notes/${req.dir}`);
  }
  next();
};
