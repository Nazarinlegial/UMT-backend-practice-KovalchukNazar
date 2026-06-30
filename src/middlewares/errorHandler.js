import multer from "multer";

import { config } from "../config/env.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { MESSAGES } from "../constants/messages.js";

// Maps a couple of well-known Prisma error codes to clean HTTP responses so the
// client never sees a raw ORM stack trace.
function mapPrismaError(err) {
  if (err.code === "P2025") {
    return { status: HTTP_STATUS.NOT_FOUND, message: MESSAGES.bouquetNotFound };
  }
  return null;
}

// Central error handler — the single place that shapes every error response as
// { message }. Must be registered last, after all routes.
export function errorHandler(err, _req, res, _next) {
  // Multer (file upload) errors.
  if (err instanceof multer.MulterError) {
    const isTooLarge = err.code === "LIMIT_FILE_SIZE";
    const status = isTooLarge ? HTTP_STATUS.BAD_REQUEST : HTTP_STATUS.BAD_REQUEST;
    return res.status(status).json({ message: isTooLarge ? MESSAGES.fileTooLarge : err.message });
  }

  // Known Prisma errors carry a code like "P2025".
  if (typeof err?.code === "string" && err.code.startsWith("P")) {
    const mapped = mapPrismaError(err);
    if (mapped) {
      return res.status(mapped.status).json({ message: mapped.message });
    }
  }

  const status = err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message =
    status === HTTP_STATUS.INTERNAL_SERVER_ERROR ? MESSAGES.serverError : err.message || MESSAGES.serverError;

  if (!config.isProduction) {
    console.error(err);
  }

  res.status(status).json({ message });
}
