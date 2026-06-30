import Joi from "joi";

const fields = {
  title: Joi.string().trim().min(2).max(200).label("title"),
  description: Joi.string().trim().min(5).max(1000).label("description"),
  price: Joi.number().integer().min(0).max(1_000_000).label("price"),
  descriptionLong: Joi.string().trim().max(4000).allow("", null).label("descriptionLong"),
  alt: Joi.string().trim().max(300).allow("", null).label("alt"),
  photoURL2x: Joi.string().trim().max(2000).allow("", null).label("photoURL2x"),
  favorite: Joi.boolean().label("favorite"),
};

// GET /bouquets query params (all optional — absent page/perPage => full list).
export const listBouquetsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).label("page"),
  perPage: Joi.number().integer().min(1).max(100).label("perPage"),
  search: Joi.string().trim().max(200).allow("").label("search"),
  favorite: Joi.boolean().label("favorite"),
});

// POST /bouquets — the image arrives as a file, not in the body.
export const createBouquetSchema = Joi.object({
  title: fields.title.required(),
  description: fields.description.required(),
  price: fields.price.required(),
  descriptionLong: fields.descriptionLong,
  alt: fields.alt,
  photoURL2x: fields.photoURL2x,
  favorite: fields.favorite.default(false),
});

// PUT /bouquets/:id — update passed fields; empty body is rejected (min 1).
export const updateBouquetSchema = Joi.object({
  title: fields.title,
  description: fields.description,
  price: fields.price,
  descriptionLong: fields.descriptionLong,
  alt: fields.alt,
  photoURL2x: fields.photoURL2x,
  favorite: fields.favorite,
}).min(1);

// PATCH /bouquets/:id/favorite — optional explicit value; empty body toggles.
export const favoriteBouquetSchema = Joi.object({
  favorite: fields.favorite,
});
