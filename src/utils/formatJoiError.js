// Turns a Joi validation error into a single readable sentence, e.g.
//   "title is required. price must be a number"
export function formatJoiError(error) {
  return error.details.map((detail) => detail.message.replace(/"/g, "")).join(". ");
}
