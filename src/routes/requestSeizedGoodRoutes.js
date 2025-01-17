import express from "express";
const router = express.Router();

import {
  requestSeizedGoodItem,
  getAllGoodsRequests,
  getGoodRequestById,
  updateRequestGood,
  deleteGoodRequestById,
  approveRequest,
  getUserRequests,
} from "../controllers/requestSeizedGoodController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import requireRole from "../middlewares/requireRole.js";
import { isIdIntegerValidationRules } from "../validators/integerIdValidator.js";
import { handleValidationErrors } from "../middlewares/handleValidationErrors.js";

// POST - Create new request
router.post("/", isAuthenticated, requestSeizedGoodItem);

// GET - Get all requests
router.get("/", isAuthenticated, requireRole("ADMIN"),getAllGoodsRequests);

// GET - Get requests for the logged-in user (no ID needed)
router.get("/me", isAuthenticated, getUserRequests);

// GET - Get specific request by ID (requires ID validation)
router.get(
  "/:id",
  isAuthenticated,
  isIdIntegerValidationRules,
  handleValidationErrors,
  getGoodRequestById
);

// PUT - Update specific request by ID (requires ID validation and admin role)
router.put(
  "/:id",
  isAuthenticated,
  isIdIntegerValidationRules,
  handleValidationErrors,
  requireRole("ADMIN"),
  updateRequestGood
);

// DELETE - Delete specific request by ID (requires ID validation and admin role)
router.delete(
  "/:id",
  isAuthenticated,
  isIdIntegerValidationRules,
  handleValidationErrors,
  requireRole("ADMIN"),
  deleteGoodRequestById
);

// PATCH - Approve request by ID (requires admin role)
router.patch(
  "/:id/approve",
  isAuthenticated,
  requireRole("ADMIN"),
  approveRequest
);

export default router;
