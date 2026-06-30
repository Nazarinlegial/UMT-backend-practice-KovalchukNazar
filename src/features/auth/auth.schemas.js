import Joi from "joi";

export const loginSchema = Joi.object({
  username: Joi.string().trim().required().label("username"),
  password: Joi.string().required().label("password"),
});
