const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const teacherSchema = mongoose.Schema({
  name: { type: String, required: true, max: 50 },
  email: { type: String, required: true, unique: true },
  department: {
    type: String,
    enum: ["BBA", "CS", "EE", "AAF", "BED", "NA"],
    default: "NA",
  },
  courses: { type: Array, default: [] },
  dateCreated: { type: Date, default: Date.now() },
  password: { type: String, required: true, max: 50, min: 8 },
  token: { type: String },
});
teacherSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id }, "jwtPrivateKey");
};
function validate(item) {
  const schema = Joi.object({
    name: Joi.string().required().max(50),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).max(50),
    department: Joi.string().required(),
  });

  return schema.validate(item);
}

// dateCreated: Joi.date().,
const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = { Teacher, validate };
