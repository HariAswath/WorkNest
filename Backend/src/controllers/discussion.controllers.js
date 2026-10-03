import { Discussion } from "../models/discussion.models.js";
import { DiscussionReply } from "../models/discussionReply.models.js";
import { Project } from "../models/project.models.js";
import { Task } from "../models/task.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import mongoose from "mongoose";

// Create a new discussion thread
const createDiscussion = asyncHandler(async (req, res) => {
  const { title, content, channel, project, tags, linkedTasks } = req.body;

  let validatedProject = null;
  if (project) {
    const existingProject = await Project.findById(project);
    if (!existingProject) {
      throw new ApiError(404, "Project workspace not found");
    }
    validatedProject = existingProject._id;
  }

  const discussion = await Discussion.create({
    title,
    content,
    channel: channel || "general",
    project: validatedProject,
    tags: Array.isArray(tags) ? tags : [],
    linkedTasks: Array.isArray(linkedTasks) ? linkedTasks : [],
    author: req.user._id,
    reactions: [],
  });

  const populated = await Discussion.findById(discussion._id)
    .populate("author", "username fullName email avatar")
    .populate("project", "name description")
    .populate("linkedTasks", "title status priority");

  return res
    .status(201)
    .json(new ApiResponse(201, populated, "Discussion thread created successfully"));
});

// Get discussions with filters (channel, project, tag, search)
const getDiscussions = asyncHandler(async (req, res) => {
  const { channel, project, tag, search } = req.query;

  const query = {};

  if (channel && channel !== "all") {
    query.channel = channel;
  }

  if (project) {
    query.project = new mongoose.Types.ObjectId(project);
  }

  if (tag) {
    query.tags = { $in: [tag.toLowerCase().trim()] };
  }

  if (search) {
    const regex = new RegExp(search, "i");
    query.$or = [{ title: regex }, { content: regex }, { tags: regex }];
  }

  const discussions = await Discussion.find(query)
    .sort({ isPinned: -1, lastReplyAt: -1, createdAt: -1 })
    .populate("author", "username fullName email avatar")
    .populate("project", "name description")
    .populate("linkedTasks", "title status priority");

  return res
    .status(200)
    .json(new ApiResponse(200, discussions, "Discussions fetched successfully"));
});

// Get discussion by ID
const getDiscussionById = asyncHandler(async (req, res) => {
  const { discussionId } = req.params;

  const discussion = await Discussion.findById(discussionId)
    .populate("author", "username fullName email avatar")
    .populate("project", "name description")
    .populate("linkedTasks", "title status priority assignedTo");

  if (!discussion) {
    throw new ApiError(404, "Discussion thread not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, discussion, "Discussion details fetched"));
});

// Update discussion thread
const updateDiscussion = asyncHandler(async (req, res) => {
  const { discussionId } = req.params;
  const { title, content, channel, tags, linkedTasks } = req.body;

  const discussion = await Discussion.findById(discussionId);
  if (!discussion) {
    throw new ApiError(404, "Discussion thread not found");
  }

  // Ensure user is author or workspace admin
  if (
    discussion.author.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "You are not authorized to update this discussion");
  }

  if (title) discussion.title = title;
  if (content) discussion.content = content;
  if (channel) discussion.channel = channel;
  if (tags) discussion.tags = tags;
  if (linkedTasks) discussion.linkedTasks = linkedTasks;

  await discussion.save();

  const updated = await Discussion.findById(discussion._id)
    .populate("author", "username fullName email avatar")
    .populate("project", "name description")
    .populate("linkedTasks", "title status priority");

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Discussion thread updated successfully"));
});

// Delete discussion and associated replies
const deleteDiscussion = asyncHandler(async (req, res) => {
  const { discussionId } = req.params;

  const discussion = await Discussion.findById(discussionId);
  if (!discussion) {
    throw new ApiError(404, "Discussion thread not found");
  }

  if (
    discussion.author.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "You are not authorized to delete this discussion");
  }

  await DiscussionReply.deleteMany({ discussion: discussion._id });
  await Discussion.findByIdAndDelete(discussionId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Discussion thread deleted successfully"));
});

// Toggle Pin state of discussion
const togglePinDiscussion = asyncHandler(async (req, res) => {
  const { discussionId } = req.params;

  const discussion = await Discussion.findById(discussionId);
  if (!discussion) {
    throw new ApiError(404, "Discussion thread not found");
  }

  discussion.isPinned = !discussion.isPinned;
  await discussion.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { isPinned: discussion.isPinned },
        discussion.isPinned ? "Discussion pinned" : "Discussion unpinned"
      )
    );
});

// Toggle reaction on discussion
const toggleDiscussionReaction = asyncHandler(async (req, res) => {
  const { discussionId } = req.params;
  const { emoji } = req.body;

  const discussion = await Discussion.findById(discussionId);
  if (!discussion) {
    throw new ApiError(404, "Discussion thread not found");
  }

  const userId = req.user._id;
  const reactionIndex = discussion.reactions.findIndex((r) => r.emoji === emoji);

  if (reactionIndex > -1) {
    const userIndex = discussion.reactions[reactionIndex].users.findIndex(
      (u) => u.toString() === userId.toString()
    );

    if (userIndex > -1) {
      discussion.reactions[reactionIndex].users.splice(userIndex, 1);
      if (discussion.reactions[reactionIndex].users.length === 0) {
        discussion.reactions.splice(reactionIndex, 1);
      }
    } else {
      discussion.reactions[reactionIndex].users.push(userId);
    }
  } else {
    discussion.reactions.push({ emoji, users: [userId] });
  }

  await discussion.save();

  return res
    .status(200)
    .json(new ApiResponse(200, discussion.reactions, "Reaction updated"));
});

// Fetch all replies for a discussion
const getDiscussionReplies = asyncHandler(async (req, res) => {
  const { discussionId } = req.params;

  const replies = await DiscussionReply.find({ discussion: discussionId })
    .sort({ createdAt: 1 })
    .populate("author", "username fullName email avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, replies, "Replies fetched successfully"));
});

// Create a reply to discussion
const createDiscussionReply = asyncHandler(async (req, res) => {
  const { discussionId } = req.params;
  const { content, parentReply } = req.body;

  const discussion = await Discussion.findById(discussionId);
  if (!discussion) {
    throw new ApiError(404, "Discussion thread not found");
  }

  const reply = await DiscussionReply.create({
    discussion: discussionId,
    author: req.user._id,
    content,
    parentReply: parentReply || null,
    reactions: [],
  });

  discussion.repliesCount += 1;
  discussion.lastReplyAt = new Date();
  await discussion.save();

  const populated = await DiscussionReply.findById(reply._id).populate(
    "author",
    "username fullName email avatar"
  );

  return res
    .status(201)
    .json(new ApiResponse(201, populated, "Reply added successfully"));
});

// Delete a reply
const deleteDiscussionReply = asyncHandler(async (req, res) => {
  const { discussionId, replyId } = req.params;

  const reply = await DiscussionReply.findById(replyId);
  if (!reply) {
    throw new ApiError(404, "Reply not found");
  }

  if (
    reply.author.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "You are not authorized to delete this reply");
  }

  await DiscussionReply.findByIdAndDelete(replyId);

  await Discussion.findByIdAndUpdate(discussionId, {
    $inc: { repliesCount: -1 },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Reply deleted successfully"));
});

// Toggle reaction on a reply
const toggleReplyReaction = asyncHandler(async (req, res) => {
  const { replyId } = req.params;
  const { emoji } = req.body;

  const reply = await DiscussionReply.findById(replyId);
  if (!reply) {
    throw new ApiError(404, "Reply not found");
  }

  const userId = req.user._id;
  const reactionIndex = reply.reactions.findIndex((r) => r.emoji === emoji);

  if (reactionIndex > -1) {
    const userIndex = reply.reactions[reactionIndex].users.findIndex(
      (u) => u.toString() === userId.toString()
    );

    if (userIndex > -1) {
      reply.reactions[reactionIndex].users.splice(userIndex, 1);
      if (reply.reactions[reactionIndex].users.length === 0) {
        reply.reactions.splice(reactionIndex, 1);
      }
    } else {
      reply.reactions[reactionIndex].users.push(userId);
    }
  } else {
    reply.reactions.push({ emoji, users: [userId] });
  }

  await reply.save();

  return res
    .status(200)
    .json(new ApiResponse(200, reply.reactions, "Reaction updated"));
});

export {
  createDiscussion,
  getDiscussions,
  getDiscussionById,
  updateDiscussion,
  deleteDiscussion,
  togglePinDiscussion,
  toggleDiscussionReaction,
  getDiscussionReplies,
  createDiscussionReply,
  deleteDiscussionReply,
  toggleReplyReaction,
};
