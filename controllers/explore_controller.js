const TWEET = require("../models/tweets_model");
const USER = require("../models/user_model");

async function sortTweetsByLatest(req, res) {
  try {
    const tweets = await TWEET.find({}).sort({ createdAt: -1 }).exec();
    return res.status(200).json({
      message: "latest",
      latestTweets: tweets,
    });
  } catch (error) {
    res.json({ error: error.message });
  }
}

// assuming more like = more trending
async function sortByTrending(req, res) {
  console.log("most trending sort...");
  try {
    const tweet = await TWEET.find({}).sort({ likes: -1 }).exec();
    return res.status(200).json({
      message: "trending",
      trendyTweets: tweet,
    });
  } catch (error) {
    return res.json({ message: `error occured, ${error.message}` });
  }
}

// searching features
async function handleSearchQuery(req, res) {
  const searchQuery = req.query.q;
  try {
    const result = await TWEET.find({ $text: { $search: searchQuery } })
      .sort({ likes: -1 })
      .exec();
    if (!result) {
      return res.status(400).json({ message: `tweet not found` });
    }
    return res.status(200).json({
      message: "your searches..",
      queries: req.query,
      results: result,
    });
  } catch (error) {
    return res.json({ message: `Error occured, ${error.message}` });
  }
}

module.exports = {
  sortTweetsByLatest,
  sortByTrending,
  handleSearchQuery,
};
