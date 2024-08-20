const express = require("express");
const router = express.Router();

const {
  sortTweetsByLatest,
  sortByTrending,
  handleSearchQuery,
} = require("../controllers/explore_controller");

// route sorting the tweets by date of creation
router.get("/sort/latest", sortTweetsByLatest);

// route sorting the tweets by popularity
router.get("/sort/trending", sortByTrending);

// routes for searching tweets
router.get("/search/", handleSearchQuery);

module.exports = router;
