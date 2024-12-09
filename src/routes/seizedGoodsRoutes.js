import express from "express";
import {
  createSeizedGood,
  getAllSeizedGoods,
  getSeizedGoodById,
  updateSeizedGood,
  deleteSeizedGood,
} from "../controllers/seizedGoodController.js";

import uploadFiles from "../middlewares/uploadFilesMulter.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post(
  "/",
  isAuthenticated,
  uploadFiles.array("files", 5),
  createSeizedGood
);
router.get("/", getAllSeizedGoods);
router.get("/:id", getSeizedGoodById);
router.put("/:id", updateSeizedGood);
router.delete("/:id", deleteSeizedGood);

export default router;
