import { HTTP_STATUS } from "../../constants/httpStatus.js";
import { MESSAGES } from "../../constants/messages.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as orderService from "./order.service.js";

export const list = asyncHandler(async (req, res) => {
  const result = await orderService.list(req.validated.query);
  res.status(HTTP_STATUS.OK).json(result);
});

export const getById = asyncHandler(async (req, res) => {
  const order = await orderService.getById(req.validated.params.id);
  res.status(HTTP_STATUS.OK).json({ data: order });
});

export const create = asyncHandler(async (req, res) => {
  const order = await orderService.create(req.validated.body);
  res.status(HTTP_STATUS.CREATED).location(`/api/orders/${order.id}`).json({ data: order });
});

export const update = asyncHandler(async (req, res) => {
  const order = await orderService.update(req.validated.params.id, req.validated.body);
  res.status(HTTP_STATUS.OK).json({ data: order });
});

export const remove = asyncHandler(async (req, res) => {
  await orderService.remove(req.validated.params.id);
  res.status(HTTP_STATUS.OK).json({ message: MESSAGES.orderDeleted });
});
