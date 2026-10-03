import { CalendarEvent } from "../models/event.models.js";
import { Task } from "../models/task.models.js";
import { Project } from "../models/project.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import mongoose from "mongoose";

// Fetch Calendar Events
const getCalendarEvents = asyncHandler(async (req, res) => {
  const { project, eventType, startDate, endDate, search } = req.query;

  const query = {};

  if (project && project !== "all") {
    query.project = new mongoose.Types.ObjectId(project);
  }

  if (eventType && eventType !== "all") {
    query.eventType = eventType;
  }

  if (startDate || endDate) {
    query.startDate = {};
    if (startDate) query.startDate.$gte = new Date(startDate);
    if (endDate) query.startDate.$lte = new Date(endDate);
  }

  if (search) {
    const regex = new RegExp(search, "i");
    query.$or = [{ title: regex }, { description: regex }];
  }

  const events = await CalendarEvent.find(query)
    .sort({ startDate: 1 })
    .populate("createdBy", "username fullName email avatar")
    .populate("project", "name")
    .populate("attendees", "username fullName email avatar")
    .populate("linkedTask", "title status priority");

  return res
    .status(200)
    .json(new ApiResponse(200, events, "Calendar events fetched successfully"));
});

// Create Calendar Event
const createCalendarEvent = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    eventType,
    project,
    startDate,
    endDate,
    allDay,
    meetingLink,
    color,
    attendees,
    linkedTask,
  } = req.body;

  let validatedProject = null;
  if (project) {
    const existingProject = await Project.findById(project);
    if (!existingProject) {
      throw new ApiError(404, "Project workspace not found");
    }
    validatedProject = existingProject._id;
  }

  const event = await CalendarEvent.create({
    title,
    description: description || "",
    eventType: eventType || "milestone",
    project: validatedProject,
    startDate: new Date(startDate),
    endDate: endDate ? new Date(endDate) : null,
    allDay: allDay !== undefined ? allDay : true,
    meetingLink: meetingLink || "",
    color: color || "amber",
    createdBy: req.user._id,
    attendees: Array.isArray(attendees) ? attendees : [],
    linkedTask: linkedTask || null,
  });

  const populated = await CalendarEvent.findById(event._id)
    .populate("createdBy", "username fullName email avatar")
    .populate("project", "name")
    .populate("attendees", "username fullName email avatar")
    .populate("linkedTask", "title status priority");

  return res
    .status(201)
    .json(new ApiResponse(201, populated, "Calendar event created successfully"));
});

// Get Event by ID
const getCalendarEventById = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  const event = await CalendarEvent.findById(eventId)
    .populate("createdBy", "username fullName email avatar")
    .populate("project", "name description")
    .populate("attendees", "username fullName email avatar")
    .populate("linkedTask", "title status priority assignedTo");

  if (!event) {
    throw new ApiError(404, "Calendar event not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, event, "Calendar event details fetched"));
});

// Update Calendar Event
const updateCalendarEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const updates = req.body;

  const event = await CalendarEvent.findById(eventId);
  if (!event) {
    throw new ApiError(404, "Calendar event not found");
  }

  // Author or admin can update
  if (
    event.createdBy.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "You are not authorized to update this event");
  }

  if (updates.title) event.title = updates.title;
  if (updates.description !== undefined) event.description = updates.description;
  if (updates.eventType) event.eventType = updates.eventType;
  if (updates.project !== undefined) event.project = updates.project || null;
  if (updates.startDate) event.startDate = new Date(updates.startDate);
  if (updates.endDate !== undefined)
    event.endDate = updates.endDate ? new Date(updates.endDate) : null;
  if (updates.allDay !== undefined) event.allDay = updates.allDay;
  if (updates.meetingLink !== undefined) event.meetingLink = updates.meetingLink;
  if (updates.color) event.color = updates.color;
  if (updates.attendees) event.attendees = updates.attendees;
  if (updates.linkedTask !== undefined) event.linkedTask = updates.linkedTask || null;

  await event.save();

  const populated = await CalendarEvent.findById(event._id)
    .populate("createdBy", "username fullName email avatar")
    .populate("project", "name")
    .populate("attendees", "username fullName email avatar")
    .populate("linkedTask", "title status priority");

  return res
    .status(200)
    .json(new ApiResponse(200, populated, "Calendar event updated successfully"));
});

// Delete Calendar Event
const deleteCalendarEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  const event = await CalendarEvent.findById(eventId);
  if (!event) {
    throw new ApiError(404, "Calendar event not found");
  }

  if (
    event.createdBy.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "You are not authorized to delete this event");
  }

  await CalendarEvent.findByIdAndDelete(eventId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Calendar event deleted successfully"));
});

// Get Combined Schedule: Events + Tasks with Due Dates
const getAggregatedSchedule = asyncHandler(async (req, res) => {
  const { project, startDate, endDate } = req.query;

  const eventQuery = {};
  const taskQuery = {};

  if (project && project !== "all") {
    eventQuery.project = new mongoose.Types.ObjectId(project);
    taskQuery.project = new mongoose.Types.ObjectId(project);
  }

  const [events, tasks] = await Promise.all([
    CalendarEvent.find(eventQuery)
      .sort({ startDate: 1 })
      .populate("createdBy", "username fullName avatar")
      .populate("project", "name")
      .populate("linkedTask", "title status priority"),
    Task.find(taskQuery)
      .populate("assignedTo", "username fullName avatar")
      .populate("project", "name"),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        events,
        tasks,
      },
      "Schedule telemetry fetched successfully"
    )
  );
});

export {
  getCalendarEvents,
  createCalendarEvent,
  getCalendarEventById,
  updateCalendarEvent,
  deleteCalendarEvent,
  getAggregatedSchedule,
};
