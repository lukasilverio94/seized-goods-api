import prisma from "../../prisma/client.js";
import {
  findSeizedGoodById,
  updateSeizedGoodById,
} from "../repositories/SeizedGoodsRepository.js";
import AppError from "../utils/AppError.js";

export const updateSeizedGoodService = async (id, data) => {
  const { name, description, value, categoryId } = data;

  const seizedGood = await findSeizedGoodById(id);

  if (!seizedGood) {
    throw new AppError("Seized good not found", 404);
  }

  const updatedData = {};

  if (name) updatedData.name = name;
  if (description) updatedData.description = description;
  if (value) updatedData.value = value;

  if (categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(categoryId) },
    });
    if (!category) {
      throw new AppError("Invalid cateogoryId provided", 404);
    }
    updatedData.categoryId = parseInt(categoryId);
  }

  return updateSeizedGoodById(id, updatedData);
};
