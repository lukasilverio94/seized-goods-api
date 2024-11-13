import express from "express";
import {
  createSocialOrganization,
  deleteSocialOrganization,
  getAllSocialOrganizations,
  getSocialOrganizationById,
  updateSocialOrganization,
} from "../controllers/socialOrganizationController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createSocialOrganization);
router.get("/", authMiddleware, getAllSocialOrganizations);
router.get("/:id", authMiddleware, getSocialOrganizationById);
router.put("/:id", authMiddleware, updateSocialOrganization);
router.delete("/:id", authMiddleware, deleteSocialOrganization);

export default router;
