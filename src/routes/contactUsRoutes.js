import { Router } from "express";
import { contactUs } from "../controllers/contactUsController.js";
import { contactUsValidationRules } from "../validators/contactUsForm.js";
import { handleValidationErrors } from "../middlewares/handleValidationErrors.js";
import contactFormLimiter from "../middlewares/rateLimitRequest.js";

const router = Router();

router.post(
  "",
  contactFormLimiter,
  contactUsValidationRules,
  handleValidationErrors,
  contactUs
);

export default router;
