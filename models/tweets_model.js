const { Schema, model } = require("mongoose");

const tweetSchema = new Schema(
  {
    content: {
      type: String,
      Date: Date.now(),
    },

    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
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
