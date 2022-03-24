const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { Admin, validate } = require("../models/admin");

const passport = require("passport");
router.use(passport.initialize());

const getAdminAuth = require("../middlewares/adminAuth");
getAdminAuth();

router.post("/register", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details);

    let admin = await Admin.findOne({ email: req.body.email });
    if (admin) return res.status(400).send("Try different email");

    admin = new Admin(req.body);
    admin.password = await bcrypt.hash(admin.password, 10);
    await admin.save();
    res.status(200).send(admin);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/login", async (req, res) => {
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
      const token = admin.generateAuthToken();

      res.status(201).send({
        user: admin,
        token,
        status: "Successfull",
      });
    } else {
      res.status(400).send("Invalid Credentials");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post(
  "/testing",
  passport.authenticate("admin-rule", { session: false }),
  (req, res) => {
    res.send(req.headers.authorization);
  }
);
module.exports = router;
