import { body } from "express-validator";

export const validateOtpCodeRules = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be a valid email address"),
  body("otp")
    .notEmpty()
    .withMessage("OTP Code is required")
    .isNumeric()
    .withMessage("OTP Code is expected to be numeric")
    .isLength(6)
    .withMessage("OTP should be 6 digits long"),
];

export const resendOtpCodeRules = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be a valid email address"),
];
