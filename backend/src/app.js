require("./db/conn");

const express = require("express");
const app = express();
const Port = process.env.PORT | 8000;
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

//Routes
const adminRoute = require("./routes/admins");
const teacherActivities = require("./routes/teacher_Activities");
const teacherLogin = require("./routes/teacher_Login");
const teacherCourses = require("./routes/teacher_Courses");
const studentRoute = require("./routes/students");

app.use(express.static("public"));
app.use(express.json());

app.get("/form", (req, res) => {
  res.sendFile("/public/index.html");
});

app.use("/admin", adminRoute);
app.use("/teacher", [teacherActivities, teacherLogin, teacherCourses]);
app.use("/student", studentRoute);

app.listen(Port, () => {
  console.log("Server connected at port 8000");
});
