import { body } from "express-validator";

export const validateCreateFeedback = [
  body("organizationId")
    .isNumeric()
    .withMessage("organizationId must be a number")
    .notEmpty()
    .withMessage("organizationId is required")
    .toInt(),

  body("seizedGoodId")
    .isNumeric()
    .withMessage("seizedGoodId must be a number")
    .notEmpty()
    .withMessage("seizedGoodId is required")
    .toInt(),

  body("testimonial")
    .optional()
    .isString()
    .withMessage("Testimonial must be a string"),

  body("impactStats")
    .optional()
    .isString()
    .withMessage("ImpactStats must be a string"),
];
