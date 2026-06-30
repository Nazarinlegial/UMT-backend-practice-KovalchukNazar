import jwt from "jsonwebtoken";

import { config } from "../config/env.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { MESSAGES } from "../constants/messages.js";

// Protects mutating/back-office endpoints. Requires a valid JWT issued by
// POST /api/auth/login, sent as `Authorization: Bearer <token>`.
export function requireAuth(req, res, next) {
  const header = req.get("authorization") ?? "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MESSAGES.unauthorized });
  }

  try {
    const payload = jwt.verify(token, config.jwt.secret);
    req.user = { id: payload.sub, username: payload.username, role: payload.role };
    return next();
  } catch {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MESSAGES.unauthorized });
  }
}
