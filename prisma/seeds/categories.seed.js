import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedCategories() {
  console.log("Seeding categories...");

  const categories = [
    { name: "Electronics" },
    { name: "Furniture" },
    { name: "Clothing" },
    { name: "Toys" },
    { name: "Food" },
    { name: "Books" },
  ];

  try {
    console.log(`Seeding ${categories.length} categories...`);

    await Promise.all(
      categories.map(async (category) => {
        try {
          await prisma.category.upsert({
            where: { name: category.name },
            update: {},
            create: category,
          });
          console.log(`Category "${category.name}" seeded successfully.`);
        } catch (error) {
          console.error(`Error seeding category "${category.name}":`, error);
        }
      })
    );

    console.log("Categories seeded successfully.");
  } catch (error) {
    console.error("Error during category seeding:", error);
  } finally {
    await prisma.$disconnect();
  }
}
