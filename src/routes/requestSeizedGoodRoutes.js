import express from "express";
const router = express.Router();

import {
  handlePostRequestItem,
  handleGetAllRequestItems,
  handleGetRequest,
  handleUpdateRequestItem,
  handleDeleteRequestItem,
  handleApproveRequest,
  handleGetUserRequests,
} from "../controllers/requestSeizedGoodController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import requireRole from "../middlewares/requireRole.js";
import { isIdIntegerValidationRules } from "../validators/integerIdValidator.js";
import { handleValidationErrors } from "../middlewares/handleValidationErrors.js";

// POST - Create new request
router.post("/", isAuthenticated, handlePostRequestItem);

// GET - Get all requests
router.get(
  "/",
  isAuthenticated,
  requireRole("ADMIN"),
  handleGetAllRequestItems
);

// GET - Get requests for the logged-in user (no ID needed)
router.get("/me", isAuthenticated, handleGetUserRequests);

// GET - Get specific request by ID (requires ID validation)
router.get(
  "/:id",
  isAuthenticated,
  isIdIntegerValidationRules,
  handleValidationErrors,
  handleGetRequest
);

// PUT - Update specific request by ID (requires ID validation and admin role)
router.put(
  "/:id",
  isAuthenticated,
  isIdIntegerValidationRules,
  handleValidationErrors,
  requireRole("ADMIN"),
  handleUpdateRequestItem
);

// DELETE - Delete specific request by ID (requires ID validation and admin role)
router.delete(
  "/:id",
  isAuthenticated,
  isIdIntegerValidationRules,
  handleValidationErrors,
  requireRole("ADMIN"),
  handleDeleteRequestItem
);

// PATCH - Approve request by ID (requires admin role)
router.patch(
  "/:id/approve",
  isAuthenticated,
  requireRole("ADMIN"),
  handleApproveRequest
);

export default router;
