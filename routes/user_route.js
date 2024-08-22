const express = require("express");
const router = express.Router();

const {
  handleUserLogin,
  handleUserSignUp,
  handleUserLogout,
  handleRefreshToken,
  handleFollowUser,
  handleUnfollowUser,
  handleUserProfile,
  handleGetUserBio,
} = require("../controllers/user_controller");
const { isLoggedIn } = require("../controllers/auth_controller");

// routes
router.post("/signup", handleUserSignUp);

router.post("/login", handleUserLogin);

router.get("/logout", handleUserLogout);

router.route("/refresh-token").post(handleRefreshToken);

// routes for handling follow and followers
// /:userId ==> it must contain the id of the user that is trying to follow that user.
router.post("/follow/:userId", isLoggedIn, handleFollowUser);
router.post("/unfollow/:userId", isLoggedIn, handleUnfollowUser);

// routes for handling user profile
router.post("/bio", isLoggedIn, handleGetUserBio);
router.get("/profile/:userId", isLoggedIn, handleUserProfile);

module.exports = router;
