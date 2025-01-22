import * as seizedGoodRepository from "../repositories/seizedGoodRepository.js";
import { uploadImagesToCloudinary } from "../utils/uploadToCloudinary.js";
import AppError from "../utils/AppError.js";
import { broadcastItemsToOrganizations } from "../events/serverSentEvents.js";

export const registerSeizedGood = async (seizedGoodData, files) => {
  const { name, description, value, quantity, categoryId, condition } =
    seizedGoodData;

  if (
    !name ||
    !description ||
    !value ||
    !quantity ||
    !categoryId ||
    !condition
  ) {
    throw new AppError("All fields are required", 400);
  }

  const parsedQuantity = parseInt(quantity, 10);
  const parsedValue = parseFloat(value);

  const category = await seizedGoodRepository.findCategoryById(categoryId);
  if (!category) {
    throw new AppError("Invalid Category ID provided", 404);
  }

  const seizedGood = await seizedGoodRepository.createSeizedGood({
    name,
    description,
    quantity: parsedQuantity,
    availableQuantity: parsedQuantity,
    value: parsedValue,
    categoryId: parseInt(categoryId, 10),
    condition,
  });

  const notification = {
    type: "new_item_of_interest",
    id: seizedGood.id,
    name: seizedGood.name,
    value: seizedGood.value,
    quantity: seizedGood.availableQuantity,
    description: seizedGood.description,
    category: category.name,
    condition: seizedGood.condition,
  };

  broadcastItemsToOrganizations(notification, categoryId);

  if (files && files.length > 0) {
    const imageUrls = await uploadImagesToCloudinary(files);
    console.log("imageUrls:", imageUrls);
    await Promise.all(
      imageUrls.map((url) =>
        seizedGoodRepository.saveImage({
          url,
          altText: "Seized Good Image",
          seizedGoodId: seizedGood.id,
        })
      )
    );
  }

  return seizedGood;
};

export const getAllSeizedGoods = async (filters, page, limit) => {
  const pagination = {};
  if (page && page > 1) {
    pagination.skip = (page - 1) * (limit ? parseInt(limit, 10) : 10);
  }
  if (limit) {
    pagination.take = parseInt(limit, 10);
  }

  return seizedGoodRepository.findSeizedGoods(filters, pagination, {
    createdAt: "desc",
  });
};

export const getSeizedGoodById = async (id) => {
  const seizedGood = await seizedGoodRepository.findSeizedGoodById(id);
  if (!seizedGood) {
    throw new AppError("Seized Good not found!", 404);
  }
  return seizedGood;
};

export const updateSeizedGood = async (id, updates) => {
  const { categoryId } = updates;

  if (categoryId) {
    const category = await seizedGoodRepository.findCategoryById(categoryId);
    if (!category) {
      throw new AppError("Invalid Category ID provided", 404);
    }
  }

  return seizedGoodRepository.updateSeizedGood(id, updates);
};

export const deleteSeizedGood = async (id, sseClients) => {
  const seizedGood = await seizedGoodRepository.findSeizedGoodById(id);
  if (!seizedGood) {
    throw new AppError("Seized Good not found", 404);
  }

  await seizedGoodRepository.deleteSeizedGoodById(id);

  const message = JSON.stringify({
    type: "delete",
    id: seizedGood.id,
  });
  sseClients.forEach((client) => {
    client.write(`data: ${message}\n\n`);
  });

  return "Seized Good deleted successfully.";
};
