import { Router } from "express";
import {
  handlePostFeedback,
  handleDeleteFeedback,
  handleGetAllFeedbacks,
  handleGetFeedback,
  handleUpdateFeedback,
} from "../controllers/feedbackControllers.js";
import { validateCreateFeedback } from "../validators/feedbacks.js";
import { handleValidationErrors } from "../middlewares/handleValidationErrors.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import requireRole from "../middlewares/requireRole.js";

const router = Router();

router.post(
  "/",
  isAuthenticated,
  validateCreateFeedback,
  handleValidationErrors,
  handlePostFeedback
);

router.get("/", handleGetAllFeedbacks);

router.get("/:fbId", handleGetFeedback);

router.put(
  "/:fbId",
  isAuthenticated,
  requireRole("ADMIN"),
  validateCreateFeedback,
  handleValidationErrors,
  handleUpdateFeedback
);

router.delete(
  "/:fbId",
  isAuthenticated,
  requireRole("ADMIN"),
  handleDeleteFeedback
);
export default router;
