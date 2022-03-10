const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const adminSchema = mongoose.Schema({
  name: { type: String, required: true, max: 50 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, max: 50, min: 8 },
  token: { type: String },
});

adminSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id }, "jwtPrivateKey", {
    expiresIn: "2h",
  });
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
