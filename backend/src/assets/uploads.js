const multer = require("multer");

const fs = require("fs");

const createDir = (dir) => {
  fs.mkdir(`./${dir}`, (err) => {
    if (err) {
      throw err;
    }
    console.log("Directory is created.");
  });
};

var notesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/notes");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

var notesMulter = multer({ storage: notesStorage });

module.exports = { notesMulter };
