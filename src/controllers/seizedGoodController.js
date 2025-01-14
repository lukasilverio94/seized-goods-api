import prisma from "../../prisma/client.js";
import { broadcastToClients, sseClients } from "../events/serverSentEvents.js";
import AppError from "../utils/AppError.js";
import { uploadImagesToCloudinary } from "../utils/uploadToCloudinary.js";

export const createSeizedGood = async (req, res, next) => {
  const { name, description, value, quantity, categoryId, condition } =
    req.body;

  // Ensure all required fields are present
  if (
    !name ||
    !description ||
    !value ||
    !quantity ||
    !categoryId ||
    !condition
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!condition) {
    return next(new Error("Condition cannot be empty"));
  }

  const parsedQuantity = parseInt(quantity, 10);
  const parsedValue = parseFloat(value);

  try {
    const seizedGood = await prisma.seizedGood.create({
      data: {
        name,
        description,
        quantity: parsedQuantity,
        availableQuantity: parsedQuantity,
        value: parsedValue,
        categoryId: parseInt(categoryId, 10),
        condition: condition,
      },
    });

    const category = await prisma.category.findUnique({
      where: { id: parseInt(categoryId) },
    });

    if (!category) {
      throw new AppError("Invalid Category ID provided", 404);
    }

    // Create notification payload
    const notification = {
      type: "new",
      id: seizedGood.id,
      name: seizedGood.name,
      value: seizedGood.value,
      quantity: seizedGood.availableQuantity,
      description: seizedGood.description,
      category: category.name,
      condition: seizedGood.condition,
    };

    // Notify NGOs clients for the corresponding category by id
    broadcastToClients(notification, parseInt(categoryId));

    // Handle images if provided
    if (req.files && req.files.length > 0) {
      const imageUrls = await uploadImagesToCloudinary(req.files);

      const imageSavePromises = imageUrls.map((url) =>
        prisma.image.create({
          data: {
            url,
            altText: "Seized Good Image",
            seizedGoodId: seizedGood.id,
          },
        })
      );

      await Promise.all(imageSavePromises);
    }

    res.status(201).json(seizedGood);
  } catch (error) {
    next(error);
  }
};

export const getAllSeizedGoods = async (req, res, next) => {
  try {
    const { categoryId, searchTerm, page = 1, limit } = req.query;

    const filters = {};

    if (categoryId) {
      filters.categoryId = parseInt(categoryId);
    }
    if (searchTerm) {
      filters.name = {
        contains: searchTerm,
        mode: "insensitive",
      };
    }

    const seizedGoods = await prisma.seizedGood.findMany({
      where: filters,
      include: {
        images: true,
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      ...(page && page > 1
        ? { skip: (page - 1) * (limit ? parseInt(limit) : 10) }
        : {}), // Include `skip` only if it's valid
      ...(limit ? { take: parseInt(limit) } : {}),
    });

    return res.status(200).json(seizedGoods);
  } catch (error) {
    next(error);
  }
};

export const getSeizedGoodById = async (req, res) => {
  const { id } = req.params;
  try {
    const seizedGood = await prisma.seizedGood.findUnique({
      where: { id: parseInt(id) },
      include: {
        images: true,
        category: true,
      },
    });

    if (!seizedGood) {
      return res.status(404).json({ error: "Seized Good not found!" });
    }

    res.json(seizedGood);
  } catch (error) {
    next(error);
  }
};

export const updateSeizedGood = async (req, res, next) => {
  const { id } = req.params;
  const { name, description, value, quantity, categoryId } = req.body;

  try {
    const data = {};

    if (name) data.name = name;
    if (description) data.description = description;
    if (quantity) data.quantity = quantity;
    if (value) data.value = parseFloat(value);

    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: parseInt(categoryId) },
      });

      if (!category) {
        throw new AppError("Invalid categoryId provided", 404);
      }
      data.categoryId = parseInt(categoryId);
    }

    const updatedSeizedGood = await prisma.seizedGood.update({
      where: { id: parseInt(id) },
      include: {
        images: true,
        category: true,
      },
      data,
    });

    res.status(200).json(updatedSeizedGood);
  } catch (error) {
    next(error);
  }
};

export const deleteSeizedGood = async (req, res, next) => {
  const { id } = req.params;

  try {
    const seizedGood = await prisma.seizedGood.findUnique({
      where: { id: parseInt(id) },
    });

    if (!seizedGood) {
      return res.status(404).json({ error: "Seized good not found" });
    }

    await prisma.seizedGood.delete({
      where: { id: parseInt(id) },
    });

    // Notify SSE clients about the deletion
    const message = JSON.stringify({
      type: "delete",
      id: seizedGood.id,
    });
    sseClients.forEach((client) => {
      client.write(`data: ${message}\n\n`);
    });

    res.status(200).json({ message: "Seized good deleted successfully" });
  } catch (error) {
    next(error);
  }
};
