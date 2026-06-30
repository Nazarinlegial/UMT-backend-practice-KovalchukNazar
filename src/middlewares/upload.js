import multer from "multer";

import { config } from "../config/env.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { MESSAGES } from "../constants/messages.js";
import { HttpError } from "../utils/HttpError.js";

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

// Reject anything that isn't a real image before it is buffered.
function fileFilter(_req, file, cb) {
  if (ALLOWED_MIME.has(file.mimetype)) {
    return cb(null, true);
  }
  return cb(new HttpError(HTTP_STATUS.BAD_REQUEST, MESSAGES.imageInvalidType));
}

// Files are buffered in memory and streamed to Cloudinary by the storage layer.
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.upload.maxFileSizeBytes },
  fileFilter,
});
