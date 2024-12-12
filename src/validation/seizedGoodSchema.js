import Joi from "joi";

// Validation schema for seized goods query
export const querySchema = Joi.object({
  categoryId: Joi.number().integer().optional().positive(),
  searchTerm: Joi.string().max(100).optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(10),
});
