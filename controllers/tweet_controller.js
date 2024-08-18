const TWEET = require("../models/tweets_model");
const USER = require("../models/user_model");

async function handleGetHomePage(req, res) {
  const allTweets = await TWEET.find();
  return res.json({
    message: "welcome to home page",
    valid: req.user,
    tweets: allTweets,
  });
}

async function handleCreateTweet(req, res) {
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
}

async function handleUpdateTweet(req, res) {
  const { content } = req.body;
  const tweetID = req.params.tweetId;
  if (!tweetID || !content) {
    throw new Error("some error occured");
  }
  try {
    const tweet = await TWEET.findById(tweetID);
    if (!tweet) {
      throw new Error("tweet not found");
    }
    const updatedTweet = await TWEET.findByIdAndUpdate(tweet._id, { content });
    await updatedTweet.save();
    return res.status(200).json({ message: "tweet updated successfully" });
  } catch (error) {
    next(error);
  }
}

async function handleDeleteTweet(req, res) {
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
}

async function handleLikes(req, res, next) {
  const tweetId = req.params.id || req.body.id;
  if (!tweetId) {
    return res.status(400).json({ error: "No ID provided" });
  }
  try {
    const tweet = await TWEET.findById(tweetId);
    if (!tweet) {
      return res.status(404).json({ error: "No tweet found" });
    }

    const user = await USER.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "No user found" });
    }

    // adding or removing likes on a post
    if (!tweet.likes.includes(user._id)) {
      await TWEET.findByIdAndUpdate(tweet._id, {
        $push: {
          likes: user._id,
        },
      });
    } else {
      await TWEET.findByIdAndUpdate(tweet._id, {
        $pull: {
          likes: user._id,
        },
      });
    }

    // adding or removing likedPost from the user schema
    if (!user.likedPost.includes(tweet._id)) {
      await USER.findByIdAndUpdate(user._id, {
        $push: {
          likedPost: tweet._id,
        },
      });
    } else {
      await USER.findByIdAndUpdate(user._id, {
        $pull: {
          likedPost: tweet._id,
        },
      });
    }

    // sending response after operation
    res.status(200).json({
      message: "success",
      tweets: {
        tweet,
      },
    });
  } catch (error) {
    next(error);
  }
}





module.exports = {
  handleGetHomePage,
  handleCreateTweet,
  handleUpdateTweet,
  handleDeleteTweet,
  handleLikes,
};
