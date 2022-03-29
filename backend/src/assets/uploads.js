const multer = require("multer");
const fs = require("fs");
const { Note } = require("../models/note");

const checkDuplication = async (name, direc) => {
  const notes = await Note.find({});

  let arr = [];

  for (let objs of notes) {
    for (let dir of objs.filesPath) {
      arr.push(dir);
    }
  }

  let status = arr.includes(process.env.DIR_PATH + direc + "/" + name);

  console.log(arr);
  console.log(status);

  if (status) {
    console.log(name + "+");
    return name + "+";
  } else {
    console.log(name);
    return name;
  }
};

var notesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/notes/" + req.dir);
  },
  filename: async (req, file, cb) => {
    let name = await checkDuplication(file.filename, req.dir);
    cb(null, file.filename);
  },
});

var notesMulter = multer({ storage: notesStorage });

module.exports = { notesMulter };
