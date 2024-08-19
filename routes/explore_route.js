const express = require("express");
const router = express.Router();

const { sortTweetsByLatest } = require("../controllers/explore_controller");

// route sorting the tweets by date of creation
router.get("/sort/latest", sortTweetsByLatest);

module.exports = router;
