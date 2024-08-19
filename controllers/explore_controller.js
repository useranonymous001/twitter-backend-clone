const TWEET = require("../models/tweets_model");
const USER = require("../models/user_model");

async function sortTweetsByLatest(req, res) {
  console.log("sorting....");
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

module.exports = {
  sortTweetsByLatest,
};
