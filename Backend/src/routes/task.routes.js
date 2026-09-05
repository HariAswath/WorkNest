import { Router } from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  createSubTask,
  updateSubTask,
  deleteSubTask,
} from "../controllers/task.controllers.js";
import { validate } from "../middleware/validator.middleware.js";
import {
  createTaskValidator,
  updateTaskValidator,
  createSubTaskValidator,
  updateSubTaskValidator,
} from "../validators/index.js";
import {
  verifyJWT,
  validateProjectPermission,
} from "../middleware/auth.middleware.js";
import { AvailableUserRole, UserRolesEnum } from "../utils/constant.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

// All task routes require user authentication
router.use(verifyJWT);

// Project tasks endpoints
router
  .route("/:projectId")
  .get(
    validateProjectPermission(AvailableUserRole),
    getTasks
  )
  .post(
    validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]),
    upload.array("attachments", 5),
    createTaskValidator(),
    validate,
    createTask
  );

// Individual task endpoints
router
  .route("/:projectId/t/:taskId")
  .get(
    validateProjectPermission(AvailableUserRole),
    getTaskById
  )
  .put(
    validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]),
    upload.array("attachments", 5),
    updateTaskValidator(),
    validate,
    updateTask
  )
  .delete(
    validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]),
    deleteTask
  );

// Subtask creation under a specific task
router
  .route("/:projectId/t/:taskId/subtasks")
  .post(
    validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]),
    createSubTaskValidator(),
    validate,
    createSubTask
  );

// Subtask management endpoints
router
  .route("/:projectId/st/:subTaskId")
  .put(
    validateProjectPermission(AvailableUserRole),
    updateSubTaskValidator(),
    validate,
    updateSubTask
  )
  .delete(
    validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN]),
    deleteSubTask
  );

export default router;
