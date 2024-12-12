import Joi from "joi";

// Validation schema for seized goods query
export const querySchema = Joi.object({
  categoryId: Joi.number().integer().optional().positive(),
  searchTerm: Joi.string().max(100).optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(10),
});

// validation for create seized good
export const createSeizedGoodSchema = Joi.object({
  name: Joi.string().max(100).required().messages({
    "string.base": `Name should be a type of 'text'`,
    "string.empty": `Name can't be an empty field`,
    "any.required": `"name" is a required field`,
  }),
  description: Joi.string().max(500).required().messages({
    "string.base": `Description should be a type of 'text'`,
    "string.empty": `Description cannot be an empty field`,
    "any.required": `Description is a required field`,
  }),
  value: Joi.number().positive().precision(2).required().messages({
    "number.base": `Value should be a valid number`,
    "number.positive": `Value must be greater than zero`,
    "any.required": `Value is a required field`,
  }),
  quantity: Joi.number().integer().positive().required().messages({
    "number.base": `Quantity should be a valid integer`,
    "number.positive": `Quantity must be greater than zero`,
    "any.required": `Quantity is a required field`,
  }),
  categoryId: Joi.number().integer().positive().required().messages({
    "number.base": `Category should be a valid integer`,
    "number.positive": `Category must be greater than zero`,
    "any.required": `Category is a required field`,
  }),
});

// validation for update seized good
export const updateSeizedGoodSchema = Joi.object({
  name: Joi.string().max(100).optional().messages({
    "string.base": `Name should be a type of 'text'`,
    "string.empty": `Name cannot be an empty field`,
  }),
  description: Joi.string().max(500).optional().messages({
    "string.base": `Description should be a type of 'text'`,
    "string.empty": `Description cannot be an empty field`,
  }),
  value: Joi.number().positive().precision(2).optional().messages({
    "number.base": `Value should be a valid number`,
    "number.positive": `Value must be greater than zero`,
  }),
  quantity: Joi.number().integer().positive().optional().messages({
    "number.base": `Quantity should be a valid integer`,
    "number.positive": `Quantity must be greater than zero`,
  }),
  categoryId: Joi.number().integer().positive().optional().messages({
    "number.base": `"Category should be a valid integer`,
    "number.positive": `"Category must be greater than zero`,
  }),
});
