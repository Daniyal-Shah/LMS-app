const multer = require("multer");
const fs = require("fs");
const {} = require("../models/course");

// const getDateFormated = () => {
//   const d = new Date();
//   let month = d.getMonth();
//   let day = d.getDay();
//   let year = d.getFullYear();
//   return `${day}-${month}-${year}`;
// };

var notesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/notes/" + req.dir);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

var notesMulter = multer({ storage: notesStorage });

module.exports = { notesMulter };
