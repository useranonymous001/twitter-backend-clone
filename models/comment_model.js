const { model, Schema } = require("mongoose");

const commentSchema = new Schema(
  {
    body: {
      type: String,
    },

    commentBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    tweetId: {
      type: Schema.Types.ObjectId,                                       
      ref: "tweet",
    },
  },
  { timestamps: true }
);

const Comment = model("comment", commentSchema);
module.exports = Comment;
