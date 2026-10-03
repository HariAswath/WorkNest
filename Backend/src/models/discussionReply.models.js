import mongoose, { Schema } from "mongoose";

const replyReactionSchema = new Schema(
  {
    emoji: {
      type: String,
      required: true,
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { _id: false }
);

const discussionReplySchema = new Schema(
  {
    discussion: {
      type: Schema.Types.ObjectId,
      ref: "Discussion",
      required: true,
      index: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    parentReply: {
      type: Schema.Types.ObjectId,
      ref: "DiscussionReply",
      default: null,
    },
    reactions: [replyReactionSchema],
  },
  { timestamps: true }
);

discussionReplySchema.index({ discussion: 1, createdAt: 1 });

export const DiscussionReply = mongoose.model(
  "DiscussionReply",
  discussionReplySchema
);
