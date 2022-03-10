const express = require("express");
const router = express.Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");
const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");

router.post("/register", async (req, res) => {
  const { error } = validateAdmin(req.body);

  if (error) return res.status(400).send(error.details);

  let admin = await Admin.findOne({ email: req.body.email });
  if (admin) return res.status(400).send("Try different email");

  admin = new Admin(req.body);
  admin.password = await bcrypt.hash(admin.password, 10);
  admin.token = admin.generateAuthToken();
  await admin.save();

  res.status(200).json(admin);
});

router.post("/login", auth, async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All inputs are required");
    }
    // Validate if user exist in our database
    const admin = await Admin.findOne({ email });

    if (admin && (await bcrypt.compare(password, admin.password))) {
      const token = jwt.sign({ _id: admin._id, email }, "jwtPrivateKey", {
        expiresIn: "2h",
      });

      admin.token = token;
      res.status(201).json(admin);
    } else {
      res.status(400).send("Invalid Credentials");
    }
  } catch (error) {
    res.status(500).send(error);
  }
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
