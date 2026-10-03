import { body } from "express-validator";
import {
  AvailableUserRole,
  AvailableTaskStatuses,
  AvailableDiscussionChannels,
  AvailableEventTypes,
} from "../utils/constant.js";

const userRegisterValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLowercase()
      .withMessage("Username must be in lower case")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long"),
    body("password").trim().notEmpty().withMessage("Password is required"),
    body("fullName").optional().trim(),
  ];
};

const userLoginValidator = () => {
  return [
    body("email").optional().isEmail().withMessage("Email is invalid"),
    body("password").notEmpty().withMessage("Password is required"),
  ];
};

const userChangeCurrentPasswordValidator = () => {
  return [
    body("oldPassword").notEmpty().withMessage("Old password is required"),
    body("newPassword").notEmpty().withMessage("New password is required"),
  ];
};

const userForgotPasswordValidator = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
  ];
};

const userResetForgotPasswordValidator = () => {
  return [body("newPassword").notEmpty().withMessage("Password is required")];
};

const createProjectValidator = () => {
  return [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").optional(),
  ];
};

const addMembertoProjectValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("role")
      .notEmpty()
      .withMessage("Role is required")
      .isIn(AvailableUserRole)
      .withMessage("Role is invalid"),
  ];
};

const createTaskValidator = () => {
  return [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description").optional(),
    body("assignedTo").optional().isMongoId().withMessage("Invalid assignedTo user ID"),
    body("status")
      .optional()
      .isIn(AvailableTaskStatuses)
      .withMessage("Invalid task status"),
  ];
};

const updateTaskValidator = () => {
  return [
    body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
    body("description").optional(),
    body("assignedTo").optional().isMongoId().withMessage("Invalid assignedTo user ID"),
    body("status")
      .optional()
      .isIn(AvailableTaskStatuses)
      .withMessage("Invalid task status"),
  ];
};

const createSubTaskValidator = () => {
  return [body("title").trim().notEmpty().withMessage("Title is required")];
};

const updateSubTaskValidator = () => {
  return [
    body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
    body("isCompleted").optional().isBoolean().withMessage("isCompleted must be a boolean"),
  ];
};

const createNoteValidator = () => {
  return [body("content").trim().notEmpty().withMessage("Content is required")];
};

const updateNoteValidator = () => {
  return [body("content").trim().notEmpty().withMessage("Content is required")];
};

const createDiscussionValidator = () => {
  return [
    body("title").trim().notEmpty().withMessage("Discussion title is required"),
    body("content").trim().notEmpty().withMessage("Discussion content is required"),
    body("channel")
      .optional()
      .isIn(AvailableDiscussionChannels)
      .withMessage("Invalid discussion channel"),
    body("project").optional({ values: "null" }).isMongoId().withMessage("Invalid project ID"),
    body("tags").optional().isArray().withMessage("Tags must be an array of strings"),
    body("linkedTasks").optional().isArray().withMessage("Linked tasks must be an array of task IDs"),
  ];
};

const updateDiscussionValidator = () => {
  return [
    body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
    body("content").optional().trim().notEmpty().withMessage("Content cannot be empty"),
    body("channel")
      .optional()
      .isIn(AvailableDiscussionChannels)
      .withMessage("Invalid discussion channel"),
    body("tags").optional().isArray().withMessage("Tags must be an array of strings"),
  ];
};

const createDiscussionReplyValidator = () => {
  return [
    body("content").trim().notEmpty().withMessage("Reply content is required"),
    body("parentReply").optional({ values: "null" }).isMongoId().withMessage("Invalid parent reply ID"),
  ];
};

const toggleReactionValidator = () => {
  return [body("emoji").trim().notEmpty().withMessage("Emoji is required")];
};

const createCalendarEventValidator = () => {
  return [
    body("title").trim().notEmpty().withMessage("Event title is required"),
    body("startDate").notEmpty().withMessage("Start date is required"),
    body("eventType")
      .optional()
      .isIn(AvailableEventTypes)
      .withMessage("Invalid event type"),
    body("project").optional({ values: "null" }).isMongoId().withMessage("Invalid project ID"),
    body("color")
      .optional()
      .isIn(["amber", "indigo", "emerald", "rose", "cyan", "purple"])
      .withMessage("Invalid color code"),
  ];
};

const updateCalendarEventValidator = () => {
  return [
    body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
    body("eventType")
      .optional()
      .isIn(AvailableEventTypes)
      .withMessage("Invalid event type"),
    body("color")
      .optional()
      .isIn(["amber", "indigo", "emerald", "rose", "cyan", "purple"])
      .withMessage("Invalid color code"),
  ];
};

export {
  userRegisterValidator,
  userLoginValidator,
  userChangeCurrentPasswordValidator,
  userForgotPasswordValidator,
  userResetForgotPasswordValidator,
  createProjectValidator,
  addMembertoProjectValidator,
  createTaskValidator,
  updateTaskValidator,
  createSubTaskValidator,
  updateSubTaskValidator,
  createNoteValidator,
  updateNoteValidator,
  createDiscussionValidator,
  updateDiscussionValidator,
  createDiscussionReplyValidator,
  toggleReactionValidator,
  createCalendarEventValidator,
  updateCalendarEventValidator,
};

