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

router.post("/", createSeizedGood);
router.get("/", getAllSeizedGoods);
router.get("/:id", getSeizedGoodById);
router.put("/:id", updateSeizedGood);
router.delete("/:id", deleteSeizedGood);

export default router;
