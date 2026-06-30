import Joi from "joi";

const fields = {
  name: Joi.string().trim().min(2).max(120).label("name"),
  phone: Joi.string()
    .trim()
    .pattern(/^[0-9 +()-]{7,30}$/)
    .label("phone")
    .messages({ "string.pattern.base": "phone must be a valid phone number" }),
  address: Joi.string().trim().max(300).allow("").label("address"),
  message: Joi.string().trim().max(1000).allow("").label("message"),
  quantity: Joi.number().integer().min(1).max(1000).label("quantity"),
  bouquetId: Joi.number().integer().positive().allow(null).label("bouquetId"),
};

export const listOrdersQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).label("page"),
  perPage: Joi.number().integer().min(1).max(100).default(20).label("perPage"),
});

export const createOrderSchema = Joi.object({
  name: fields.name.required(),
  phone: fields.phone.required(),
  address: fields.address.default(""),
  message: fields.message.default(""),
  quantity: fields.quantity.default(1),
  bouquetId: fields.bouquetId.default(null),
});

export const updateOrderSchema = Joi.object({
  name: fields.name,
  phone: fields.phone,
  address: fields.address,
  message: fields.message,
  quantity: fields.quantity,
  bouquetId: fields.bouquetId,
}).min(1);
