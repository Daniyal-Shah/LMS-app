require("./db/conn");
const Admin = require("./models/admin");
const express = require("express");
const app = express();
const Port = process.env.PORT | 8000;

//Routes
const adminRoute = require("./routes/admins");
const teacherRoute = require("./routes/teachers");

app.use(express.json());
app.use("/admin", adminRoute);
app.use("/teacher", teacherRoute);

app.listen(Port, () => {
  console.log("Server connected at port 8000");
});
