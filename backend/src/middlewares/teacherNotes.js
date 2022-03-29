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

  req.allNotes = await getAllNotes();
  req.allNames = await getAllNames();
  req.rootDirectory = process.env.DIR_PATH + req.dir;

  if (!fs.existsSync("./src/assets/notes/" + req.dir)) {
    fs.mkdirSync(`./src/assets/notes/${req.dir}`);
  }
  next();
};

const getAllNames = async () => {
  const allNotes = await getAllNotes();
  const allNames = [];

  if (allNotes && allNotes.length > 0) {
    allNotes.map((i) => {
      let values = i.split("/");
      allNames.push(values[values.length - 1]);
    });
  }

  return allNames;
};

const getAllNotes = async () => {
  const notes = await Note.find({});

  let arr = [];

  for (let objs of notes) {
    for (let dir of objs.filesPath) {
      arr.push(dir);
    }
  }

  return arr;
};
