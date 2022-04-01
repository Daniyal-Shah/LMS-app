const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const studentSchema = mongoose.Schema({
  studentId: { type: String, required: true, min: 9 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, max: 50, min: 8 },
  name: { type: String, max: 30, required: true },
  batch: { type: Number, max: 2022, min: 2000 },
  gender: { type: String, enum: ["male", "female"], required: true },
  fatherName: { type: String, max: 30, required: true },
  department: {
    type: String,
    enum: ["BBA", "CS", "EE", "AAF", "BED", "NA"],
    default: "NA",
  },
  courses: [
    {
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        refer: "Course",
        unique: true,
      },
      enrolledDate: { type: Date, default: Date.now() },
    },
  ],
  dateCreated: { type: Date, default: Date.now() },
});

studentSchema.methods.generateAuthToken = function () {
  return jwt.sign({ id: this._id }, "jwtPrivateKey", { expiresIn: "1d" });
};

function validate(item) {
  const schema = Joi.object({
    studentId: Joi.string().min(9),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).max(50),
    name: Joi.string().required().max(30),
    batch: Joi.number().max(2022).min(2000),
    gender: Joi.string().required(),
    fatherName: Joi.string().max(30).required(),
    department: Joi.string().required(),
    // courses: Joi.array().required(),
  });

  return schema.validate(item);
}

const Student = mongoose.model("Student", studentSchema);

module.exports = { validate, Student };
