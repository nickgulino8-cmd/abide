import { PrismaClient } from "@prisma/client";
import { seedDefaults } from "../src/lib/categories";

const db = new PrismaClient();
seedDefaults(db)
  .then(async () => {
    console.log(`✔ Seeded ${await db.category.count()} categories`);
  })
  .finally(() => db.$disconnect());
