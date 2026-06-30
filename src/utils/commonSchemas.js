import Joi from "joi";

// Shared `:id` path-parameter schema (positive integer).
export const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required().label("id"),
});
