import { MESSAGES } from "../../constants/messages.js";
import { HttpError } from "../../helpers/HttpError.js";
import { buildPaginatedResponse, getPaginationBounds } from "../../helpers/pagination.js";
import * as bouquetRepository from "../bouquets/bouquet.repository.js";
import * as orderRepository from "./order.repository.js";

// Guard referential integrity at the application level too: a client must not be
// able to attach an order to a non-existent bouquet.
async function assertBouquetExists(bouquetId) {
  if (bouquetId === null || bouquetId === undefined) {
    return;
  }
  const bouquet = await bouquetRepository.findById(bouquetId);
  if (!bouquet) {
    throw HttpError.badRequest(MESSAGES.bouquetNotFound);
  }
}

export async function list({ page, perPage }) {
  const totalItems = await orderRepository.count();
  const { skip, take } = getPaginationBounds({ page, perPage, totalItems });
  const items = await orderRepository.findMany({ skip, take });
  return buildPaginatedResponse(items, { page, perPage, totalItems });
}

export async function getById(id) {
  const order = await orderRepository.findById(id);
  if (!order) {
    throw HttpError.notFound(MESSAGES.orderNotFound);
  }
  return order;
}

export async function create(body) {
  await assertBouquetExists(body.bouquetId);
  return orderRepository.create(body);
}

export async function update(id, body) {
  await getById(id); // 404 if missing
  await assertBouquetExists(body.bouquetId);
  return orderRepository.update(id, body);
}

export async function remove(id) {
  await getById(id); // 404 if missing
  await orderRepository.remove(id);
}
