import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedSeizedGoods() {
  console.log("Seeding seized goods...");

  const seizedGoods = [];

  for (let i = 0; i < 100; i++) {
    const randomCategoryId = Math.floor(Math.random() * 6) + 1;
    const quantity = Math.floor(Math.random() * 100) + 1;
    const availableQuantity = quantity;
    const value = (Math.random() * 100).toFixed(2);

    seizedGoods.push({
      name: `Seized Good ${i + 1}`,
      description: `Description for seized good ${i + 1}`,
      value: parseFloat(value),
      quantity,
      availableQuantity,
      categoryId: randomCategoryId,
    });
  }

  try {
    await Promise.all(
      seizedGoods.map((good) =>
        prisma.seizedGood.create({
          data: good,
        })
      )
    );
    console.log("Seized goods seeded successfully.");
  } catch (error) {
    console.error("Error seeding seized goods:", error);
  } finally {
    await prisma.$disconnect();
  }
}
