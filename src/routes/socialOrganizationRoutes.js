import express from "express";
import {
  createSocialOrganizationWithUser,
  createSocialOrganization,
  deleteSocialOrganization,
  getAllSocialOrganizations,
  getSocialOrganizationById,
  updateSocialOrganization,
} from "../controllers/socialOrganizationController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post(
  "/register-user-and-organization",
  createSocialOrganizationWithUser
);
router.post("/", createSocialOrganization);
router.get("/", getAllSocialOrganizations);
router.get("/:id", getSocialOrganizationById);
router.put("/:id", updateSocialOrganization);
router.delete("/:id", deleteSocialOrganization);

export default router;
