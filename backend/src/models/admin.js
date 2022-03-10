const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
  name: { type: String, required: true, max: 50 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, max: 50, min: 8 },
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
