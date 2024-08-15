const { Schema, model } = require("mongoose");

const tweetSchema = new Schema(
  {
    tweet: {
      type: String,
      Date: Date.now(),
    },

    likes: [
      {
        types: Schema.Types.ObjectId,
      },
    ],

    author: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },

    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "comment",
      },
    ],
  },
  { timestamps: true }
);

const Tweet = model("tweet", tweetSchema);
module.exports = Tweet;
