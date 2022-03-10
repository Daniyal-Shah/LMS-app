const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/lms", {
    // useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Lms database connected !");
  })
  .catch((err) => {
    console.log("Something faile in connecting database");
  });
