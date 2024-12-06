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
    await Promise.all(
      categories.map((category) =>
        prisma.category.create({
          data: category,
        })
      )
    );
    console.log("Categories seeded successfully.");
  } catch (error) {
    console.error("Error seeding categories:", error);
  } finally {
    await prisma.$disconnect();
  }
}
