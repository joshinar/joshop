const express = require("express");
const { check, validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../../models/User");
const config = require("config");

// User registration route
router.post(
  "/api/users",
  [
    check("name", "Please enter your name")
      .not()
      .isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
      //    check if user exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ error: "Email is already registered" });
      }

      // create user instance
      const user = new User(req.body);

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      // Return jwtoken
      const payload = {
        userId: user.id
      };

      jwt.sign(
        payload,
        config.get("jwtsecret"),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ err: "Server Error" });
    }
  }
);
module.exports = router;
