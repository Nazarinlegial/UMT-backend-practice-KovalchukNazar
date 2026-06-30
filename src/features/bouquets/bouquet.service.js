// Business logic for bouquets: search/pagination, the image lifecycle (upload
// on create, replace + cleanup on photo update, delete on remove) and the
// favorite toggle. Throws HttpError; never touches req/res.
import { MESSAGES } from "../../constants/messages.js";
import { HttpError } from "../../helpers/HttpError.js";
import { buildPaginatedResponse, getPaginationBounds } from "../../helpers/pagination.js";
import { deleteImage, uploadImage } from "../../uploads/cloudinaryStorage.js";
import * as bouquetRepository from "./bouquet.repository.js";

function buildWhere({ search, favorite }) {
  const where = {};
  if (typeof favorite === "boolean") {
    where.favorite = favorite;
  }
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  return where;
}

export async function list({ page, perPage, search, favorite }) {
  const where = buildWhere({ search, favorite });

  // No pagination params → return the full collection ("список усіх").
  if (page == null && perPage == null) {
    const items = await bouquetRepository.findMany({ where });
    return { data: items };
  }

  const safePerPage = perPage ?? 12;
  const safePage = page ?? 1;
  const totalItems = await bouquetRepository.count(where);
  const { skip, take } = getPaginationBounds({ page: safePage, perPage: safePerPage, totalItems });
  const items = await bouquetRepository.findMany({ where, skip, take });

  return buildPaginatedResponse(items, { page: safePage, perPage: safePerPage, totalItems });
}

export async function listFavorites() {
  const items = await bouquetRepository.findFavorites();
  return { data: items };
}

export async function getById(id) {
  const bouquet = await bouquetRepository.findById(id);
  if (!bouquet) {
    throw HttpError.notFound(MESSAGES.bouquetNotFound);
  }
  return bouquet;
}

export async function create({ body, file }) {
  if (!file) {
    throw HttpError.badRequest(MESSAGES.imageRequired);
  }

  const photoURL = await uploadImage(file);

  try {
    return await bouquetRepository.create({ ...body, photoURL });
  } catch (error) {
    await deleteImage(photoURL); // roll back the orphaned upload
    throw error;
  }
}

export async function update(id, body) {
  await getById(id); // 404 if missing
  return bouquetRepository.update(id, body);
}

export async function toggleFavorite(id, favorite) {
  const existing = await getById(id);
  const nextValue = typeof favorite === "boolean" ? favorite : !existing.favorite;
  return bouquetRepository.update(id, { favorite: nextValue });
}

export async function updatePhoto(id, file) {
  const existing = await getById(id);
  if (!file) {
    throw HttpError.badRequest(MESSAGES.imageRequired);
  }

  const photoURL = await uploadImage(file);

  try {
    const updated = await bouquetRepository.update(id, { photoURL });
    await deleteImage(existing.photoURL); // remove the previous Cloudinary asset
    return updated;
  } catch (error) {
    await deleteImage(photoURL);
    throw error;
  }
}

export async function remove(id) {
  const existing = await getById(id);
  await bouquetRepository.remove(id);
  await deleteImage(existing.photoURL);
  return existing;
}
