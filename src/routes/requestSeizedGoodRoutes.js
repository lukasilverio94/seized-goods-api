import express from "express";
const router = express.Router();
import { requestSeizedGoodItem } from "../controllers/requestSeizedGoodController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

router.post("/add-items", authMiddleware, requestSeizedGoodItem);

export default router;
