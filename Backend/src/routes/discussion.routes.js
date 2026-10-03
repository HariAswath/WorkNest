import { Router } from "express";
import {
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
} from "../controllers/discussion.controllers.js";
import {
  createDiscussionValidator,
  updateDiscussionValidator,
  createDiscussionReplyValidator,
  toggleReactionValidator,
} from "../validators/index.js";
import { validate } from "../middleware/validator.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Protect all discussion routes with JWT verification
router.use(verifyJWT);

// Discussion Threads Endpoints
router
  .route("/")
  .get(getDiscussions)
  .post(createDiscussionValidator(), validate, createDiscussion);

router
  .route("/:discussionId")
  .get(getDiscussionById)
  .patch(updateDiscussionValidator(), validate, updateDiscussion)
  .delete(deleteDiscussion);

router.route("/:discussionId/pin").post(togglePinDiscussion);
router
  .route("/:discussionId/react")
  .post(toggleReactionValidator(), validate, toggleDiscussionReaction);

// Discussion Replies Endpoints
router
  .route("/:discussionId/replies")
  .get(getDiscussionReplies)
  .post(createDiscussionReplyValidator(), validate, createDiscussionReply);

router
  .route("/:discussionId/replies/:replyId")
  .delete(deleteDiscussionReply);

router
  .route("/replies/:replyId/react")
  .post(toggleReactionValidator(), validate, toggleReplyReaction);

export default router;
