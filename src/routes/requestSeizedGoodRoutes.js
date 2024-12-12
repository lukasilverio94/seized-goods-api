import express from "express";
const router = express.Router();
import {
  requestSeizedGoodItem,
  getAllGoodsRequests,
  getGoodRequestById,
  updateRequestGood,
  deleteGoodRequestById,
  approveRequest,
} from "../controllers/requestSeizedGoodController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import requireRole from "../middlewares/requireRole.js";

router.post("/", isAuthenticated, requestSeizedGoodItem);
router.get("/", isAuthenticated, getAllGoodsRequests);
router.get("/:id", isAuthenticated, getGoodRequestById);
router.put("/:id", isAuthenticated, requireRole("ADMIN"), updateRequestGood);
router.delete(
  "/:id",
  isAuthenticated,
  requireRole("ADMIN"),
  deleteGoodRequestById
);
router.patch(
  "/:id/approve",
  isAuthenticated,
  requireRole("ADMIN"),
  approveRequest
);

export default router;
