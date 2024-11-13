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

router.post("/", createSocialOrganization);
router.get("/", getAllSocialOrganizations);
router.get("/:id", getSocialOrganizationById);
router.put("/:id", updateSocialOrganization);
router.delete("/:id", deleteSocialOrganization);

export default router;
