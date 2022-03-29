const multer = require("multer");
const fs = require("fs");

var notesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/notes/" + req.dir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

var notesMulter = multer({ storage: notesStorage });

module.exports = { notesMulter };
