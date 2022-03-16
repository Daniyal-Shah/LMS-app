require("./db/conn");

const express = require("express");
const app = express();
const Port = process.env.PORT | 8000;

//Routes
const adminRoute = require("./routes/admins");
const teacherRoute = require("./routes/teachers");
const studentRoute = require("./routes/students");

app.use(express.json());
app.use("/admin", adminRoute);
app.use("/teacher", teacherRoute);
app.use("/student", studentRoute);

app.listen(Port, () => {
  console.log("Server connected at port 8000");
});
