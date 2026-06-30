// Single shared Prisma client. The `globalThis` cache prevents nodemon
// hot-reloads from opening a brand-new connection pool on every restart.
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { config } from "../config/env.js";

const adapter = new PrismaPg({ connectionString: config.databaseUrl });

const prisma = globalThis.__floraPrisma ?? new PrismaClient({ adapter });

if (!config.isProduction) {
  globalThis.__floraPrisma = prisma;
}

export default prisma;
