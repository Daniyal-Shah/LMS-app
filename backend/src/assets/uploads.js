const multer = require("multer");
const fs = require("fs");
const { Note } = require("../models/note");

require("dotenv").config();

const checkDuplication = async (name, direc) => {
  const notes = await Note.find({});

  let arr = [];

  for (let objs of notes) {
    for (let dir of objs.filesPath) {
      arr.push(dir);
    }
  }

  let status = arr.includes(process.env.DIR_PATH + direc + "/" + name);

  if (status) {
    return name + "+";
  } else {
    return name;
  }
};

var notesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/notes/" + req.dir);
  },
  filename: async (req, file, cb) => {
    file.duplication = true;
    file.name = process.env.DIR_PATH + req.dir + "/" + file.originalname;

    cb(null, file.originalname);
  },
});

var notesMulter = multer({ storage: notesStorage });

module.exports = { notesMulter };
