import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const GOOD_CONDITIONS = ["NEW", "USED", "REFURBISHED"];

const imagesUrls = [
  "https://www.lakkadhaara.com/cdn/shop/collections/New_Project-36.png?v=1705814667",
  "https://png.pngtree.com/png-vector/20230928/ourmid/pngtree-cute-bear-teddy-toy-png-image_10149481.png",
  "https://ourhome.ph/cdn/shop/files/SURREY_904d1545-07cd-490c-90d1-8b4e95ad8588.png?v=1686273357",
  "https://i.pinimg.com/originals/7a/f7/b4/7af7b469607aff47de27fac75a50de01.png",
  "https://w7.pngwing.com/pngs/487/248/png-transparent-laptop-computer-icons-laptop-electronics-gadget-image-file-formats.png",
];

function getRandomImageUrl(urls) {
  const randomIndex = Math.floor(Math.random() * imagesUrls.length);
  return urls[randomIndex];
}

function getRandomEnumValue(enumArray) {
  const randomIndex = Math.floor(Math.random() * enumArray.length);
  return enumArray[randomIndex];
}

export async function seedSeizedGoods() {
  console.log("Seeding seized goods...");

  try {
    const categories = await prisma.category.findMany({
      select: { id: true },
    });
    const categoryIds = categories.map((category) => category.id);

    if (categoryIds.length === 0) {
      throw new Error(
        "No categories found. Seed categories before seeding seized goods."
      );
    }

    const seizedGoods = [];

    for (let i = 0; i < 25; i++) {
      const randomCategoryId =
        categoryIds[Math.floor(Math.random() * categoryIds.length)];
      const quantity = Math.floor(Math.random() * 100) + 1;
      const availableQuantity = quantity;
      const value = (Math.random() * 100).toFixed(2);
      const condition = getRandomEnumValue(GOOD_CONDITIONS);
      const imageUrl = getRandomImageUrl(imagesUrls);

      seizedGoods.push({
        name: `Seized Good ${i + 1}`,
        description: `Description for seized good ${i + 1}`,
        value: parseFloat(value),
        images: {
          create: [
            {
              url: imageUrl,
              altText: `Image for seized good ${i + 1}`,
            },
          ],
        },
        quantity,
        availableQuantity,
        categoryId: randomCategoryId,
        condition,
      });
    }

    // Insert all seized goods
    await Promise.all(
      seizedGoods.map((good) =>
        prisma.seizedGood.create({
          data: good,
        })
      )
    );

    console.log("Seized goods seeded successfully.");
  } catch (error) {
    console.error("Error seeding seized goods:", error.message, error.stack);
  } finally {
    await prisma.$disconnect();
  }
}
