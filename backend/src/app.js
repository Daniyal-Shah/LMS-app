require("./db/conn");

const express = require("express");
const app = express();
const Port = process.env.PORT | 8000;
const bodyParser = require("body-parser");
const fs = require("fs");
//Routes
const adminRoute = require("./routes/admins");
const teacherLogin = require("./routes/teacher_Login");
const teacherCourses = require("./routes/teacher_Courses");
const teacherNotes = require("../src/routes/teacher_Notes");
const teacherQuiz = require("./routes/teacher_quiz");
const teacherAssignment = require("./routes/teacher_Assignments");

const studentLogin = require("./routes/student_Login");
const studentCourses = require("./routes/student_Courses");
const studentActivities = require("./routes/student_Activities");
const studentAssignments = require("./routes/student_Assignments");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use(express.static("public"));
app.use(express.json());

app.use("/admin", adminRoute);
app.use("/teacher", [
  teacherNotes,
  teacherQuiz,
  teacherLogin,
  teacherCourses,
  teacherAssignment,
]);
app.use("/student", [
  studentCourses,
  studentLogin,
  studentActivities,
  studentAssignments,
]);

app.listen(Port, () => {
  console.log("Server connected at port 8000");
});
