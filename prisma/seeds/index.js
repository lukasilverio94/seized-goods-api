import { seedCategories } from "./categories.seed.js";
import { seedSeizedGoods } from "./seizedGoods.seed.js";

async function runSeeds() {
  console.log("Starting database seeding...");

  try {
    await seedCategories();
    await seedSeizedGoods();
  } catch (error) {
    console.error("Error running seeds:", error);
  } finally {
    console.log("Seeding process completed.");
  }
}

runSeeds();
