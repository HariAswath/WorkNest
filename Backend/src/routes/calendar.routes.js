import { Router } from "express";
import {
  getCalendarEvents,
  createCalendarEvent,
  getCalendarEventById,
  updateCalendarEvent,
  deleteCalendarEvent,
  getAggregatedSchedule,
} from "../controllers/calendar.controllers.js";
import {
  createCalendarEventValidator,
  updateCalendarEventValidator,
} from "../validators/index.js";
import { validate } from "../middleware/validator.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Protect all calendar routes with JWT
router.use(verifyJWT);

router
  .route("/events")
  .get(getCalendarEvents)
  .post(createCalendarEventValidator(), validate, createCalendarEvent);

router
  .route("/events/:eventId")
  .get(getCalendarEventById)
  .patch(updateCalendarEventValidator(), validate, updateCalendarEvent)
  .delete(deleteCalendarEvent);

router.route("/schedule").get(getAggregatedSchedule);

export default router;
