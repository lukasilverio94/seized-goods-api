import { param, validationResult } from "express-validator";

export const isIdIntegerValidationRules = [
  param("id").isInt({ gt: 0 }).withMessage("ID must be a positive integer."),
];
