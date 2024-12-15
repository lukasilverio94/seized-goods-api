import express from "express";
import {
  getAllCategories,
  createCategory,
} from "../controllers/categoryItemController.js";
import { categoryValidationRules } from "../validators/category.js";
import { handleValidationErrors } from "../middlewares/handleValidationErrors.js";
const router = express.Router();

router.get("/", getAllCategories);
router.post(
  "/",
  categoryValidationRules,
  handleValidationErrors,
  createCategory
);

export default router;
