const express = require("express");
const router = express.Router();

const {
  handleUserLogin,
  handleUserSignUp,
  handleUserLogout,
  handleRefreshToken,
} = require("../controllers/user_controller");

// routes
router.post("/signup", handleUserSignUp);

router.post("/login", handleUserLogin);

router.get("/logout", handleUserLogout);

router.route("/refresh-token").post(handleRefreshToken);

module.exports = router;
