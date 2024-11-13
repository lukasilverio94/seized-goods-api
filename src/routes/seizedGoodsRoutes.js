import express from "express";
import {
  createSeizedGood,
  getAllSeizedGoods,
  getSeizedGoodById,
  updateSeizedGood,
  deleteSeizedGood,
} from "../controllers/seizedGoodController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createSeizedGood);
router.get("/", authMiddleware, getAllSeizedGoods);
router.get("/:id", authMiddleware, getSeizedGoodById);
router.put("/:id", authMiddleware, updateSeizedGood);
router.delete("/:id", authMiddleware, deleteSeizedGood);

export default router;
