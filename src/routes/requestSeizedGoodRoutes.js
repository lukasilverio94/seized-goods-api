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
import authMiddleware from "../middlewares/authMiddleware.js";

router.post("/", authMiddleware, requestSeizedGoodItem);
router.get("/", getAllGoodsRequests);
router.get("/:id", getGoodRequestById);
router.put("/:id", updateRequestGood);
router.delete("/:id", deleteGoodRequestById);
router.patch("/:id/approve", approveRequest);

export default router;
