import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import { config } from "./config/env.js";
import { HTTP_STATUS } from "./constants/httpStatus.js";
import { openapiSpec } from "./docs/openapi.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";
import apiRoutes from "./routes/index.js";

const app = express();

// Security headers.
app.use(helmet());

// CORS: when no origins are configured, reflect the request origin (open) —
// otherwise allow only the whitelisted origins.
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || config.corsOrigins.length === 0 || config.corsOrigins.includes(origin)) {
        return callback(null, true);
      }
      // Disallowed origin: don't throw (that surfaces as a 500). Just omit the
      // CORS headers — the browser blocks cross-origin reads, same-origin
      // requests (e.g. the API's own Swagger UI) keep working.
      return callback(null, false);
    },
    credentials: true,
  })
);

app.use(express.json());
// Accept form-urlencoded too, so Swagger UI's OAuth2 password flow (login form)
// can post credentials to /api/auth/login.
app.use(express.urlencoded({ extended: true }));
app.use(morgan(config.isProduction ? "short" : "dev"));

// Root: a friendly landing so the bare domain returns 200 (not a 404) and
// points visitors to the docs.
app.get("/", (_req, res) => {
  res.status(HTTP_STATUS.OK).json({
    name: "Flora API",
    status: "ok",
    docs: "/api-docs",
    health: "/health",
    api: "/api",
  });
});

// Liveness probe (useful for Render/Docker health checks).
app.get("/health", (_req, res) => {
  res.status(HTTP_STATUS.OK).json({ status: "ok", uptime: process.uptime() });
});

// Interactive API docs.
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));
app.get("/api-docs.json", (_req, res) => res.json(openapiSpec));

// API.
app.use("/api", apiRoutes);

// Unmatched routes + central error handler (must be last).
app.use(notFound);
app.use(errorHandler);

export default app;
