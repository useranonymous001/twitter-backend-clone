const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const USER = require("../models/user_model");
const { sendErrorResponse } = require("../controllers/error_handler");
const { generateToken } = require("../utils/token_generator");

// routes
router.post("/signup", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    bcrypt.hash(password, 12, async (err, hash) => {
      if (err) next(err);
      const user = await USER.create({
        username,
        email,
        password: hash,
      });
      return res.json({ success: `user account created successfully` });
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await USER.findOne({ email });
    if (!user) {
      return sendErrorResponse(res, "invalid user credentials");
    }

    const match = bcrypt.compare(password, user.password);
    if (!match) {
      return sendErrorResponse(res, "invalid user credentials");
    }
    // need changes later on
    // req.session.userId = user._id;

    const token = generateToken(user.username, user.email, user._id);
    res.cookie("isLoggedIn", token);

    return res.json({ message: `successfully logged !!` });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("isLoggedIn");
  return res.redirect("/home");
});

module.exports = router;
