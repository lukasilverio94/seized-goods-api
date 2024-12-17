import { body } from "express-validator";

export const requestResetPassRules = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be a valid email address"),
];

export const resetPasswordRules = [
  body("token")
    .notEmpty()
    .withMessage("Token is required")
    .isString()
    .withMessage("Token should be a string"),
  body("newPassword")
    .notEmpty()
    .withMessage("New Password is required")
    .isLength({ min: 8 }),
];
