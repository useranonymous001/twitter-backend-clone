const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      min: [7, "too small password"],
    },

    bio: {
      type: String,
    },

    tweets: [
      {
        type: Schema.Types.ObjectId,
        ref: "tweet",
      },
    ],

    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: "tweet",
      },
    ],

    verified: {
      type: Boolean,
      default: false,
    },

    followers: [
      {
        type: Schema.Types.ObjectId,
      },
    ],

    following: [
      {
        type: Schema.Types.ObjectId,
      },
    ],

    likedPost: [
      {
        type: Schema.Types.ObjectId,
        ref: "tweet",
      },
    ],
    commentedPost: [
      {
        type: Schema.Types.ObjectId,
        ref: "comment",
      },
    ],
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

const USER = model("user", userSchema);
module.exports = USER;
