import Joi from "joi";

const fields = {
  text: Joi.string().trim().min(5).max(2000).label("text"),
  author: Joi.string().trim().min(2).max(120).label("author"),
  location: Joi.string().trim().max(120).allow("").label("location"),
};

export const createFeedbackSchema = Joi.object({
  text: fields.text.required(),
  author: fields.author.required(),
  location: fields.location.default(""),
});

// At least one field required on PATCH.
export const updateFeedbackSchema = Joi.object({
  text: fields.text,
  author: fields.author,
  location: fields.location,
}).min(1);
