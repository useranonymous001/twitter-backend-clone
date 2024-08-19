const USER = require("../models/user_model");
const TWEET = require("../models/tweets_model");
const COMMENT = require("../models/comment_model");

async function handleCreateComment(req, res, next) {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "content cannot be empty" });
  }

  try {
    const tweetID = req.params.tweetId;

    const tweet = await TWEET.findById(tweetID);
    if (!tweet) {
      return res.status(404).json({ message: "tweet not found" });
    }
    const user = await USER.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const comment = await COMMENT.create({
      content,
      commentBy: user._id,
      tweetId: tweet._id,
    });

    await TWEET.findByIdAndUpdate(
      { _id: tweet._id },
      {
        $push: {
          comments: comment._id,
        },
      }
    );

    await USER.findByIdAndUpdate(
      { _id: user._id },
      {
        $push: {
          commentedPost: tweet._id,
        },
      }
    );

    return res.status(200).json({
      message: "successfully commented",
      tweets: tweet,
      comments: comment,
    });
  } catch (error) {
    next(error);
  }
}

async function handleUpdateComment(req, res) {
  const { content } = req.body;

  try {
    const tweetID = req.params.tweetId;
    const tweet = await TWEET.findById(tweetID);
    if (!tweet) {
      return res.status(400).json({ message: "tweet not found" });
    }

    const comment = await COMMENT.findOne({ tweetId: tweet._id });
    if (!comment) {
      return res.status(400).json({ message: "comment not found" });
    }

    const updatedComment = await COMMENT.findByIdAndUpdate(
      { _id: comment._id },
      {
        $set: {
          content,
        },
      }
    );
    return res.json({
      message: "comment updated",
      tweets: tweet,
      comments: updatedComment,
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

async function handleDeleteComment(req, res) {
  console.log(req.url);
  console.log(req.originalUrl);
}

// gets all the comments from the particular tweet
async function handleGetAllComment(req, res) {
  const tweetID = req.params.tweetId;
  try {
    const tweet = await TWEET.findById(tweetID);
    if (!tweet) {
      return res.status(404).json({ message: "tweet not found" });
    }

    const comment = await COMMENT.find({ tweetId: tweet._id });
    if (!comment) {
      return res.status(404).json({ error: "comment not found for the tweet" });
    }

    return res
      .status(200)
      .json({ message: "got all the comments", comments: comment });
  } catch (error) {}
}

module.exports = {
  handleCreateComment,
  handleUpdateComment,
  handleDeleteComment,
  handleGetAllComment,
};
