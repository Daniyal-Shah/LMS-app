const multer = require("multer");
const fs = require("fs");
const { Note } = require("../models/note");

require("dotenv").config();

var notesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/notes/" + req.dir);
  },
  filename: async (req, file, cb) => {
    let nameSplits = file.originalname.split(".");
    let ext = "." + nameSplits[nameSplits.length - 1];
    nameSplits.pop();
    let extractedName = nameSplits.join("");
    file.name = extractedName + "-" + Date.now() + ext;
    file.fullPath = process.env.DIR_PATH + req.dir + "/" + file.name;
    file.extractedName = extractedName;
    file.rootDirectory = process.env.DIR_PATH + req.dir + "/";

    cb(null, file.name);
  },
});

var notesMulter = multer({ storage: notesStorage });

var dest = (req) =>
  __dirname + "/notes/" + req.dir + "/assignment-" + req.assignmentNumber;

var assignmentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dest(req));
  },
  filename: async (req, file, cb) => {
    let nameSplits = file.originalname.split(".");
    let ext = "." + nameSplits[nameSplits.length - 1];
    nameSplits.pop();

    let extractedName = nameSplits.join("");
    file.name = extractedName + "-" + Date.now() + ext;
    file.fullPath =
      process.env.DIR_PATH +
      req.dir +
      "/assignment-" +
      req.assignmentNumber +
      file.name;

    file.extractedName = extractedName;
    // file.rootDirectory =
    //   process.env.DIR_PATH + req.dir + "/assignment-" + req.assignmentNumber;

    cb(null, file.name);
  },
});

var assignmentMulter = multer({ storage: assignmentStorage });

var studentAssignmentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dest(req) + "/" + req.user.studentId);
  },
  filename: async (req, file, cb) => {
    let nameSplits = file.originalname.split(".");
    let ext = "." + nameSplits[nameSplits.length - 1];
    nameSplits.pop();

    let extractedName = nameSplits.join("");
    file.name = extractedName + "-" + Date.now() + ext;
    file.fullPath =
      process.env.DIR_PATH +
      req.dir +
      "/assignment-" +
      req.assignmentNumber +
      "/" +
      file.name;

    file.extractedName = extractedName;
    // file.rootDirectory =
    //   process.env.DIR_PATH + req.dir + "/assignment-" + req.assignmentNumber;

    cb(null, file.name);
  },
});

var studentAssignmentMulter = multer({ storage: studentAssignmentStorage });

module.exports = { notesMulter, assignmentMulter, studentAssignmentMulter };
