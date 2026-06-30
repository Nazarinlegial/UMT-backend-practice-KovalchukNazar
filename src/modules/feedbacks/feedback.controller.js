import { HTTP_STATUS } from "../../constants/httpStatus.js";
import { MESSAGES } from "../../constants/messages.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as feedbackService from "./feedback.service.js";

export const list = asyncHandler(async (_req, res) => {
  const result = await feedbackService.list();
  res.status(HTTP_STATUS.OK).json(result);
});

export const getById = asyncHandler(async (req, res) => {
  const feedback = await feedbackService.getById(req.validated.params.id);
  res.status(HTTP_STATUS.OK).json({ data: feedback });
});

export const create = asyncHandler(async (req, res) => {
  const feedback = await feedbackService.create(req.validated.body);
  res.status(HTTP_STATUS.CREATED).location(`/api/feedbacks/${feedback.id}`).json({ data: feedback });
});

export const update = asyncHandler(async (req, res) => {
  const feedback = await feedbackService.update(req.validated.params.id, req.validated.body);
  res.status(HTTP_STATUS.OK).json({ data: feedback });
});

export const remove = asyncHandler(async (req, res) => {
  await feedbackService.remove(req.validated.params.id);
  res.status(HTTP_STATUS.OK).json({ message: MESSAGES.feedbackDeleted });
});
