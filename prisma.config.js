// Prisma CLI configuration. The runtime client connects through the
// @prisma/adapter-pg driver (see src/lib/prisma.js); this file only tells the
// CLI (migrate / db seed) where the schema, migrations and datasource live.
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node prisma/seed/index.js",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
