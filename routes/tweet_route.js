const express = require("express");
const router = express.Router();
const TWEET = require("../models/tweets_model");
const USER = require("../models/user_model");

router.get("/home", async (req, res) => {
  const allTweets = await TWEET.find();
  return res.json({
    message: "welcome to home page",
    valid: req.user,
    tweets: allTweets,
  });
});

// posting, updating and deleting the tweet
router.post("/home/", async (req, res, next) => {
  const { content } = req.body;
  if (content == null) return res.json({ message: "tweet cannot be emppty" });
  try {
    const userTweet = await TWEET.create({
      content,
      author: req.user.id,
    });
    const user = await USER.findByIdAndUpdate(
      { _id: req.user.id },
      {
        $push: {
          tweets: userTweet._id,
        },
      }
    );
    await user.save();
    return res.json({
      message: "tweet posted successfully",
      valid: req.user,
    });
  } catch (error) {
    next(error);
  }
});

// note: make the form method=PUT in frontend
router.put("/home/:tweetId", async (req, res, next) => {
  const { content } = req.body;
  const tweetID = req.params.tweetId;
  console.log(content);
  console.log(tweetID);
  if (!tweetID || !content) {
    throw new Error("some error occured");
  }
  try {
    const tweet = await TWEET.findById(tweetID);
    console.log(tweet);
    if (!tweet) {
      throw new Error("tweet not found");
    }

    const updatedTweet = await TWEET.findByIdAndUpdate(tweet._id, { content });
    await updatedTweet.save();
    return res.status(200).json({ message: "tweet updated successfully" });
  } catch (error) {
    next(error);
  }
});

router.delete("/home/:tweetId", async (req, res, next) => {
  const tweetID = req.params.tweetId;
  try {
    const tweet = await TWEET.findById(tweetID);
    if (!tweet) {
      throw new Error("tweet not found ");
    }

    await USER.findByIdAndUpdate(tweet.author, {
      $pull: {
        tweets: tweetID,
      },
    });
    await TWEET.findByIdAndDelete(tweetID);
    return res.status(200).json({
      message: "tweet deleted successfully",
      tweetId: tweetID,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
