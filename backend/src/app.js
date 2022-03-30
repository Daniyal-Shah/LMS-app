require("./db/conn");

const express = require("express");
const app = express();
const Port = process.env.PORT | 8000;
const bodyParser = require("body-parser");

//Routes
const adminRoute = require("./routes/admins");
const teacherLogin = require("./routes/teacher_Login");
const teacherCourses = require("./routes/teacher_Courses");
const teacherNotes = require("../src/routes/teacher_Notes");
const teacherQuiz = require("./routes/teacher_quiz");

const studentLogin = require("./routes/student_Login");
const studentCourses = require("./routes/student_Courses");
const studentActivities = require("./routes/student_Activities");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use(express.static("public"));
app.use(express.json());

app.use("/admin", adminRoute);
app.use("/teacher", [teacherNotes, teacherQuiz, teacherLogin, teacherCourses]);
app.use("/student", [studentCourses, studentLogin, studentActivities]);

app.listen(Port, () => {
  console.log("Server connected at port 8000");
});
