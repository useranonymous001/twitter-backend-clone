const express = require("express");
const router = express.Router();

const {
  handleGetHomePage,
  handleCreateTweet,
  handleUpdateTweet,
  handleDeleteTweet,
  handleLikes,
} = require("../controllers/tweet_controller");

// get the post
router.get("/home", handleGetHomePage);

// posting, updating and deleting the tweet
// create a post
router.post("/home", handleCreateTweet);

// note: make the form method=PUT in frontend
// update the post
router.put("/home/:tweetId", handleUpdateTweet);

// delete the post
router.delete("/home/:tweetId", handleDeleteTweet);

// router for handling likes
router.post("/:id/like", handleLikes);

/*
router for handling comment routes
*/

// create a comment on a post
router.post("/:tweetId/comment");

module.exports = router;
