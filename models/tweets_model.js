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
    tweetCoverImage: [
      {
        type: String,
        default: "/uploads/tweetCoverImages",
      },
    ],
  },
  { timestamps: true }
);

tweetSchema.index({ content: "text" });

const Tweet = model("tweet", tweetSchema);
module.exports = Tweet;
