import prisma from "../../prisma/client.js";
import { createSeizedGood } from "../repositories/SeizedGoodsRepository.js";
import AppError from "../utils/AppError.js";
import { uploadImagesToCloudinary } from "../utils/uploadToCloudinary.js";

export const createSeizedGoodService = async (
  { name, description, value, categoryId },
  files
) => {
  if (!name || !description || !value) {
    throw new AppError("All fields are required", 403);
  }

  const category = await prisma.category.findUnique({
    where: { id: parseInt(categoryId) },
  });

  if (!category) {
    throw new AppError("Invalid Category ID provided", 404);
  }

  const seizedGood = await createSeizedGood({
    name,
    description,
    value: parseFloat(value),
    categoryId: parseInt(categoryId),
  });

  if (files && files.length > 0) {
    const imageUrls = await uploadImagesToCloudinary(files);

    await Promise.all(
      imageUrls.map((url) =>
        prisma.image.create({
          data: {
            url,
            altText: "Seized Good Image",
            seizedGoodId: seizedGood.id,
          },
        })
      )
    );
  }

  return { seizedGood, category };
};
