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

router.post("/", isAuthenticated, requestSeizedGoodItem);
router.get("/", getAllGoodsRequests);
router.get("/:id", getGoodRequestById);
router.put("/:id", updateRequestGood);
router.delete("/:id", deleteGoodRequestById);
router.patch("/:id/approve", approveRequest);

export default router;
