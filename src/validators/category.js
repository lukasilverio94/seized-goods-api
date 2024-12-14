import { body } from "express-validator";

export const categoryValidationRules = [
  body("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isString()
    .isLength({ min: 2 })
    .withMessage("Category name must be at least 2 characters long"),
];
