import mongoose, { Schema } from "mongoose";
import { AvailableEventTypes, EventTypeEnum } from "../utils/constant.js";

const calendarEventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    eventType: {
      type: String,
      enum: AvailableEventTypes,
      default: EventTypeEnum.MILESTONE,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      default: null,
    },
    allDay: {
      type: Boolean,
      default: true,
    },
    meetingLink: {
      type: String,
      default: "",
      trim: true,
    },
    color: {
      type: String,
      enum: ["amber", "indigo", "emerald", "rose", "cyan", "purple"],
      default: "amber",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attendees: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    linkedTask: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    },
  },
  { timestamps: true }
);

calendarEventSchema.index({ startDate: 1, endDate: 1 });
calendarEventSchema.index({ project: 1 });
calendarEventSchema.index({ eventType: 1 });

export const CalendarEvent = mongoose.model(
  "CalendarEvent",
  calendarEventSchema
);
