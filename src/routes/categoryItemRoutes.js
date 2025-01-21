import express from "express";
import {
  getAllCategories,
  createCategory,
} from "../controllers/categoryItemController.js";
import { categoryValidationRules } from "../validators/category.js";
import { handleValidationErrors } from "../middlewares/handleValidationErrors.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import requireRole from "../middlewares/requireRole.js";
const router = express.Router();

router.get("/", getAllCategories);
router.post(
  "/",
  isAuthenticated,
  requireRole("ADMIN"),
  categoryValidationRules,
  handleValidationErrors,
  createCategory
);

export default router;
