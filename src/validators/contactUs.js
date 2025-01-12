import { body, param } from "express-validator";

export const contactUsValidationRules = [
  body("userName")
    .notEmpty()
    .withMessage("Your name is required")
    .isString()
    .withMessage("Your name must be a text")
    .isLength({ min: 2 })
    .withMessage("Your name must be at least 2 characters long"),
  body("userEmail")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be a valid email address"),
  body("subject")
    .notEmpty()
    .withMessage("Subject is required")
    .isString()
    .withMessage("Subject should be a text")
    .isLength({ min: 3 })
    .withMessage("Subject must be at least 3 characters long"),
  body("message")
    .notEmpty()
    .withMessage("A message is required")
    .isString()
    .withMessage("Message should be a text")
    .isLength({ min: 8 })
    .withMessage("Message must be at least 8 characters long"),
];

export const uuidMessageValidationRules = [
  param("msgId").isUUID().withMessage("Invalid ID format"),
];
