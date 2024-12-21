import { body, param, query } from "express-validator";

const ALLOWED_CONDITIONS = ["NEW", "USED", "REFURBISHED"];

export const validateCreateSeizedGood = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isString()
    .withMessage("Description must be a string"),
  body("value")
    .notEmpty()
    .withMessage("Value is required")
    .isFloat({ min: 0 })
    .withMessage("Value must be a positive number"),
  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be an integer greater than 0"),
  body("categoryId")
    .notEmpty()
    .withMessage("Category ID is required")
    .isInt()
    .withMessage("Category ID must be an integer"),
  body("condition")
    .notEmpty()
    .withMessage("Condition is required")
    .customSanitizer((value) => value.toUpperCase())
    .isIn(ALLOWED_CONDITIONS)
    .withMessage(`Condition must be one of: ${ALLOWED_CONDITIONS.join(", ")}`),
];

export const validateUpdateSeizedGood = [
  param("id")
    .notEmpty()
    .withMessage("ID is required")
    .isInt()
    .withMessage("ID must be an integer"),
  body("name").optional().isString().withMessage("Name must be a string"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  body("value")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Value must be a positive number"),
  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be an integer greater than 0"),
  body("categoryId")
    .optional()
    .isInt()
    .withMessage("Category ID must be an integer"),
  body("condition")
    .optional()
    .customSanitizer((value) => value.toUpperCase())
    .isIn(ALLOWED_CONDITIONS)
    .withMessage(`Condition must be one of: ${ALLOWED_CONDITIONS.join(", ")}`),
];

export const validateGetAllSeizedGoods = [
  query("categoryId")
    .optional()
    .isInt()
    .withMessage("Category ID must be an integer"),
  query("searchTerm")
    .optional()
    .isString()
    .withMessage("Search term must be a string"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit must be a positive integer"),
];

export const validateGetSeizedGoodById = [
  param("id")
    .notEmpty()
    .withMessage("ID is required")
    .isInt()
    .withMessage("ID must be an integer"),
];

export const validateDeleteSeizedGood = [
  param("id")
    .notEmpty()
    .withMessage("ID is required")
    .isInt()
    .withMessage("ID must be an integer"),
];
