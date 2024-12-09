import express from "express";
import { promoteUserToAdmin } from "../controllers/adminControllers.js";
import requireRole from "../middlewares/requireRole.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.patch(
  "/promote/:userId",
  isAuthenticated,
  requireRole("ADMIN"),
  promoteUserToAdmin
);

export default router;
