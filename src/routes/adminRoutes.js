import express from "express";
import {
  promoteUserToAdmin,
  approveSocialOrganization,
} from "../controllers/adminControllers.js";
import requireRole from "../middlewares/requireRole.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.patch(
  "/promote/:userId",
  isAuthenticated,
  requireRole("ADMIN"),
  promoteUserToAdmin
);
router.patch(
  "/approve-organization/:organizationId",
  isAuthenticated,
  requireRole("ADMIN"),
  approveSocialOrganization
);

export default router;
