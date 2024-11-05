import express from "express";
import {
  createSocialOrganization,
  getAllSocialOrganizations,
  getSocialOrganizationById,
} from "../controllers/socialOrganizationController.js";

const router = express.Router();

router.post("/", createSocialOrganization);
router.get("/", getAllSocialOrganizations);
router.get("/:id", getSocialOrganizationById);

export default router;
