const express = require("express");
const router = express.Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");

const Admin = require("../models/admin");

router.post("/admin", async (req, res) => {
  const { error } = validateAdmin(req.body);

  if (error) return res.status(400).send(error.details);

  let admin = await Admin.findOne({ email: req.body.email });

  if (admin) return res.status(400).send("Try different email");

  admin = new Admin(req.body);

  await admin.save();

  res.status(200).send(admin);
});

router.get("/admin", async (req, res) => {
  res.send("admin");
});

const validateAdmin = (user) => {
  const schema = Joi.object({
    name: Joi.string().required().max(50),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).max(50),
  });

  return schema.validate(user);
};

module.exports = router;
