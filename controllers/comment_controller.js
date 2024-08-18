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

    if (!tweetID) {
      return res.status(404).json({ message: "tweet not found" });
    }

    const user = await USER.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    if(user._id !== )


  } catch (error) {
    next(error);
  }
}

module.exports = { handleCreateComment };



