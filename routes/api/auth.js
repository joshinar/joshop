const express = require("express");
const { check, validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../../jwtmiddleware/auth");
const User = require("../../models/User");
const router = express.Router();

// @route  GET api/auth
// desc    Auth  Route
// @access Private
router.get("/api/auth", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.send(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
});

// Authenticate user and get token

router.post(
  "/api/auth",
  [
    check("email", "Please enter your registered email").isEmail(),
    check("password", "Password is required")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials" });
      }
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
      res.status(500).json({ error: "Server Error" });
    }
  }
);

module.exports = router;
