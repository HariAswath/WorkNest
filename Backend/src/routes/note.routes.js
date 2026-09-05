import { Router } from "express";
import {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
} from "../controllers/note.controllers.js";
import { validate } from "../middleware/validator.middleware.js";
import {
  createNoteValidator,
  updateNoteValidator,
} from "../validators/index.js";
import {
  verifyJWT,
  validateProjectPermission,
} from "../middleware/auth.middleware.js";
import { AvailableUserRole, UserRolesEnum } from "../utils/constant.js";

const router = Router();

// All note routes require user authentication
router.use(verifyJWT);

// Project notes endpoints
router
  .route("/:projectId")
  .get(
    validateProjectPermission(AvailableUserRole),
    getNotes
  )
  .post(
    validateProjectPermission([UserRolesEnum.ADMIN]),
    createNoteValidator(),
    validate,
    createNote
  );

// Individual note endpoints
router
  .route("/:projectId/n/:noteId")
  .get(
    validateProjectPermission(AvailableUserRole),
    getNoteById
  )
  .put(
    validateProjectPermission([UserRolesEnum.ADMIN]),
    updateNoteValidator(),
    validate,
    updateNote
  )
  .delete(
    validateProjectPermission([UserRolesEnum.ADMIN]),
    deleteNote
  );

export default router;
