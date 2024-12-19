import { Router } from "express";
import {
  addFeedback,
  deleteFeedback,
  getAllFeedbacks,
  updateFeedback,
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
  addFeedback
);

router.get("/", getAllFeedbacks);
router.put(
  "/:feedbackId",
  isAuthenticated,
  requireRole("ADMIN"),
  validateCreateFeedback,
  handleValidationErrors,
  updateFeedback
);

router.delete(
  "/:feedbackId",
  isAuthenticated,
  requireRole("ADMIN"),
  deleteFeedback
);
export default router;
