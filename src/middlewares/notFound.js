import { HTTP_STATUS } from "../constants/httpStatus.js";
import { MESSAGES } from "../constants/messages.js";

// Catch-all for unmatched routes. Registered after all real routes, before the
// error handler.
export function notFound(_req, res) {
  res.status(HTTP_STATUS.NOT_FOUND).json({ message: MESSAGES.routeNotFound });
}
