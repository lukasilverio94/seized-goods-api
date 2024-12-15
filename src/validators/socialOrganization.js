import { body, param, query } from "express-validator";

// Validation for creating a social organization with a user
export const validateCreateSocialOrganizationWithUser = [
  body("name").notEmpty().withMessage("Name is required."),
  body("email")
    .isEmail()
    .withMessage("Valid email is required.")
    .notEmpty()
    .withMessage("Email is required."),
  body("firstName").notEmpty().withMessage("First name is required."),
  body("lastName").notEmpty().withMessage("Last name is required."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
  body("categories")
    .isArray({ min: 1 })
    .withMessage("At least one category is required.")
    .custom((categories) => {
      if (categories.some((id) => isNaN(parseInt(id)))) {
        throw new Error("All category IDs must be integers.");
      }
      return true;
    }),
  body("qualifications")
    .notEmpty()
    .withMessage(
      "Qualification is required (Why your Organization qualifies for the use of this application)."
    ),
];

// Validation for creating a social organization
export const validateCreateSocialOrganization = [
  body("name").notEmpty().withMessage("Name is required."),
  body("email")
    .isEmail()
    .withMessage("Valid email is required.")
    .notEmpty()
    .withMessage("Email is required."),
  body("categories")
    .isArray({ min: 1 })
    .withMessage("At least one category is required.")
    .custom((categories) => {
      if (categories.some((id) => isNaN(parseInt(id)))) {
        throw new Error("All category IDs must be integers.");
      }
      return true;
    }),
];

// Validation for getting a social organization by ID
export const validateGetSocialOrganizationById = [
  param("id").isInt().withMessage("Organization ID must be an integer."),
];

// Validation for updating a social organization
export const validateUpdateSocialOrganization = [
  param("id").isInt().withMessage("Organization ID must be an integer."),
  body("name").optional().isString().withMessage("Name must be a string."),
  body("contactPerson")
    .optional()
    .isString()
    .withMessage("Contact person must be a string."),
  body("email").optional().isEmail().withMessage("Valid email is required."),
  body("phone").optional().isString().withMessage("Phone must be a string."),
  body("address")
    .optional()
    .isString()
    .withMessage("Address must be a string."),
  body("qualifications")
    .optional()
    .isString()
    .withMessage("Qualifications must be a string."),
];

// Validation for deleting a social organization
export const validateDeleteSocialOrganization = [
  param("id").isInt().withMessage("Organization ID must be an integer."),
];
