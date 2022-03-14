const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const courseSchema = mongoose.Schema({
  teacherId: { type: String, required: true },
  name: { type: String, required: true, max: 50 },
  department: {
    type: String,
    enum: ["BBA", "CS", "EE", "AAF", "BED", "NA"],
    default: "NA",
  },
  enrollmentCode: { type: String, max: 15, min: 5, unique: true },
  dateCreated: { type: Date, default: Date.now() },
  enrolledStudents: { type: Array, default: [] },
});

courseSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id }, "jwtPrivateKey");
};

const Course = mongoose.model("Course", courseSchema);

function validateCourse(user) {
  const schema = Joi.object({
    teacherId: Joi.string().required().max(50),
    name: Joi.string().required().max(50),
    department: Joi.string().required(),
    enrollmentCode: Joi.string().required().min(5).max(15),
    dateCreated: Joi.date(),
    enrolledStudents: Joi.array().required(),
  });

  return schema.validate(user);
}

module.exports = { Course, validateCourse };
