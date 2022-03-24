const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const adminSchema = mongoose.Schema({
  name: { type: String, required: true, max: 50 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, max: 50, min: 8 },
});

adminSchema.methods.generateAuthToken = function () {
  return jwt.sign({ id: this._id }, "jwtPrivateKey", { expiresIn: "1d" });
};

const Admin = mongoose.model("Admin", adminSchema);

function validateAdmin(user) {
  const schema = Joi.object({
    name: Joi.string().required().max(50),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).max(50),
  });

  return schema.validate(user);
}

module.exports = { Admin, validateAdmin };
