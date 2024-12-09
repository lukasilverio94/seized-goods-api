import express from "express";
import { promoteUserToAdmin } from "../controllers/adminControllers.js";
import requireRole from "../middlewares/requireRole.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.patch(
  "/promote/:userId",
  authMiddleware,
  requireRole("ADMIN"),
  promoteUserToAdmin
);

export default router;
