import app from "./app.js";
import { config } from "./config/env.js";
import prisma from "./db/prisma.js";
import { ensureAdminUser } from "./features/auth/auth.service.js";

async function start() {
  // Fail fast if the database is unreachable.
  try {
    await prisma.$connect();
    console.log("Database connection successful");
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }

  // Make sure the admin account exists (best-effort — don't block startup).
  await ensureAdminUser().catch((error) => console.error("Admin provisioning failed:", error.message));

  const server = app.listen(config.port, () => {
    console.log(`🌸 Flora API running on http://localhost:${config.port}`);
    console.log(`📚 Swagger UI:  http://localhost:${config.port}/api-docs`);
  });

  const shutdown = (signal) => {
    console.log(`\n${signal} received — shutting down gracefully...`);
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

start();
