// Idempotent database seed. Reads prisma/seed/data.json (generated from the
// Flora frontend's mock db.json) and loads bouquets + feedbacks. Safe to run
// repeatedly: it clears the tables first, in FK-safe order.
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(path.join(__dirname, "data.json"), "utf8"));

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // FK-safe order: orders reference bouquets, so clear orders first.
  await prisma.order.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.bouquet.deleteMany();

  const bouquets = await prisma.bouquet.createMany({ data: data.bouquets });
  const feedbacks = await prisma.feedback.createMany({ data: data.feedbacks });

  const favorites = data.bouquets.filter((b) => b.favorite).length;
  console.log(`Seeded ${bouquets.count} bouquets (${favorites} favorites) and ${feedbacks.count} feedbacks.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
