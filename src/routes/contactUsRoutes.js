import { Router } from "express";
import {
  handlePostContactUs,
  handleGetAllMessages,
  handleGetMessageById,
  handleDeleteMessage,
  handleDeleteAllMessages
} from "../controllers/contactUsController.js";
import {
  contactUsValidationRules,
  uuidMessageValidationRules,
} from "../validators/contactUs.js";
import { handleValidationErrors } from "../middlewares/handleValidationErrors.js";
import contactFormLimiter from "../middlewares/rateLimitRequest.js";

const router = Router();

router.post(
  "",
  contactFormLimiter,
  contactUsValidationRules,
  handleValidationErrors,
  handlePostContactUs
);

router.get("", handleGetAllMessages);

router.get(
  "/:msgId",
  uuidMessageValidationRules,
  handleValidationErrors,
  handleGetMessageById
);

router.delete("", handleDeleteAllMessages)

router.delete(
  "/:msgId",
  uuidMessageValidationRules,
  handleValidationErrors,
  handleDeleteMessage
);

export default router;
