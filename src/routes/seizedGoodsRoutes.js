import express from "express";
import {
  createSeizedGood,
  getAllSeizedGoods,
  getSeizedGoodById,
  updateSeizedGood,
  deleteSeizedGood,
} from "../controllers/seizedGoodController.js";

import uploadFiles from "../middlewares/uploadFilesMulter.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  uploadFiles.array("files", 5),
  createSeizedGood
);
router.get("/", getAllSeizedGoods);
router.get("/:id", getSeizedGoodById);
router.put("/:id", updateSeizedGood);
router.delete("/:id", deleteSeizedGood);

export default router;
