import Joi from "joi";

export const integerIdSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": `"Id must be a number`,
    "number.integer": `"Id must be an integer`,
    "number.positive": `"Id must be a positive number`,
    "any.required": `"Id is required`,
  }),
});
