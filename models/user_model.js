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
      default: "create your bio..",
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
        ref: "user",
      },
    ],

    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
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
      select: false,
    },

    userProfileImages: [
      {
        type: String,
        default: "/uploads/userProfileImages",
      },
    ],
  },
  { timestamps: true }
);

const USER = model("user", userSchema);
module.exports = USER;
