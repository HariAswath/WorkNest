import mongoose, { Schema } from "mongoose";
import { AvailableDiscussionChannels, DiscussionChannelEnum } from "../utils/constant.js";

const discussionReactionSchema = new Schema(
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

const discussionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    channel: {
      type: String,
      enum: AvailableDiscussionChannels,
      default: DiscussionChannelEnum.GENERAL,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    linkedTasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    reactions: [discussionReactionSchema],
    repliesCount: {
      type: Number,
      default: 0,
    },
    lastReplyAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

discussionSchema.index({ channel: 1, lastReplyAt: -1 });
discussionSchema.index({ project: 1 });
discussionSchema.index({ tags: 1 });

export const Discussion = mongoose.model("Discussion", discussionSchema);
