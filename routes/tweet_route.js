const express = require("express");
const router = express.Router();
const upload = require("../utils/multer_handler");
const {
  handleGetHomePage,
  handleCreateTweet,
  handleUpdateTweet,
  handleDeleteTweet,
  handleLikes,
  handleBookmarks,
} = require("../controllers/tweet_controller");

const {
  handleCreateComment,
  handleUpdateComment,
  handleDeleteComment,
  handleGetAllComment,
} = require("../controllers/comment_controller");

// get the post
router.get("/home", handleGetHomePage);

// posting, updating and deleting the tweet
// create a post
router.post("/home", upload.single("filename"), handleCreateTweet);

// note: make the form method=PUT in frontend
// update the post
router.put("/home/:tweetId", handleUpdateTweet);

// delete the post
router.delete("/home/:tweetId", handleDeleteTweet);

// router for handling likes
router.post("/:id/like", handleLikes);

/* ********** ROUTER FOR HANDLING COMMENT ROUTES STARTS HERE ********* */

// create a comment on a post
router.post("/:tweetId/comment", handleCreateComment);

// edit the comment on a post
router.put("/:tweetId/comment", handleUpdateComment);

// delete the comment
router.delete("/:tweetId/comment", handleDeleteComment);

// get all the comments on the particular post
router.get("/:tweetId/comment", handleGetAllComment);

// router for handling bookmarks in an tweet
router.post("/bookmark/:tweetId", handleBookmarks);

module.exports = router;
