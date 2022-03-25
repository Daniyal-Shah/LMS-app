// const fawn = require("fawn");
var mongoose = require("mongoose");
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

//creating bucket
// let bucket;
// mongoose.connection.on("connected", () => {
//   var db = mongoose.connections[0].db;
//   bucket = new mongoose.mongo.GridFSBucket(db, {
//     bucketName: "newBucket",
//   });
//   console.log(bucket);
// });

// fawn.init(mongoose);
