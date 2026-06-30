// HTTP layer for bouquets: request → service → response. No business logic here.
import { HTTP_STATUS } from "../../constants/httpStatus.js";
import { MESSAGES } from "../../constants/messages.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as bouquetService from "./bouquet.service.js";

export const list = asyncHandler(async (req, res) => {
  const result = await bouquetService.list(req.validated.query);
  res.status(HTTP_STATUS.OK).json(result);
});

export const favorites = asyncHandler(async (_req, res) => {
  const result = await bouquetService.listFavorites();
  res.status(HTTP_STATUS.OK).json(result);
});

export const getById = asyncHandler(async (req, res) => {
  const bouquet = await bouquetService.getById(req.validated.params.id);
  res.status(HTTP_STATUS.OK).json({ data: bouquet });
});

export const create = asyncHandler(async (req, res) => {
  const bouquet = await bouquetService.create({ body: req.validated.body, file: req.file });
  res.status(HTTP_STATUS.CREATED).location(`/api/bouquets/${bouquet.id}`).json({ data: bouquet });
});

export const update = asyncHandler(async (req, res) => {
  const bouquet = await bouquetService.update(req.validated.params.id, req.validated.body);
  res.status(HTTP_STATUS.OK).json({ data: bouquet });
});

export const toggleFavorite = asyncHandler(async (req, res) => {
  const bouquet = await bouquetService.toggleFavorite(req.validated.params.id, req.validated.body.favorite);
  res.status(HTTP_STATUS.OK).json({ data: bouquet });
});

export const updatePhoto = asyncHandler(async (req, res) => {
  const bouquet = await bouquetService.updatePhoto(req.validated.params.id, req.file);
  res.status(HTTP_STATUS.OK).json({ data: bouquet });
});

export const remove = asyncHandler(async (req, res) => {
  const bouquet = await bouquetService.remove(req.validated.params.id);
  res.status(HTTP_STATUS.OK).json({ message: MESSAGES.bouquetDeleted, data: bouquet });
});
