import prisma from "../../prisma/client.js";
import { broadcastToClients, sseClients } from "../events/serverSentEvents.js";
import AppError from "../utils/AppError.js";
import { uploadImagesToCloudinary } from "../utils/uploadToCloudinary.js";
import {
  querySchema,
  createSeizedGoodSchema,
  updateSeizedGoodSchema,
} from "../validation/seizedGoodSchema.js";
import { integerIdSchema } from "../validation/integerIdSchema.js";

export const createSeizedGood = async (req, res, next) => {
  try {
    const { error, value } = createSeizedGoodSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const validationErrors = error.details.map((err) => err.message);
      return res.status(400).json({ errors: validationErrors });
    }

    // Destructure validated values
    const { name, description, value: goodValue, quantity, categoryId } = value;

    const seizedGood = await prisma.seizedGood.create({
      data: {
        name,
        description,
        quantity,
        availableQuantity: quantity,
        value: parseFloat(goodValue),
        categoryId: parseInt(categoryId),
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
    const { error, value } = querySchema.validate(req.query);

    if (error) {
      return res
        .status(400)
        .json({ error: error.details.map((d) => d.message) });
    }

    const { categoryId, searchTerm, page, limit } = value;

    const filters = {};
    if (categoryId) {
      filters.categoryId = categoryId;
    }
    if (searchTerm) {
      filters.name = {
        contains: searchTerm,
        mode: "insensitive",
      };
    }

    const offset = (page - 1) * limit;

    const seizedGoods = await prisma.seizedGood.findMany({
      where: filters,
      include: {
        images: true,
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: offset,
      take: limit,
    });

    return res.status(200).json(seizedGoods);
  } catch (error) {
    next(error);
  }
};

export const getSeizedGoodById = async (req, res) => {
  try {
    const { error } = integerIdSchema.validate(req.params);

    if (error) {
      res.status(400).json({ error: error.details.map((err) => err.message) });
    }
    const { id } = req.params;

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
  try {
    const { id } = req.params;
    const { error, value } = updateSeizedGoodSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const validationErrors = error.details.map((err) => err.message);
      return res.status(400).json({ errors: validationErrors });
    }

    const { name, description, value: goodValue, quantity, categoryId } = value;

    const data = {};

    if (name) data.name = name;
    if (description) data.description = description;
    if (quantity) data.quantity = quantity;
    if (goodValue) data.value = parseFloat(goodValue);

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
  try {
    const { error } = integerIdSchema.validate(req.params);

    if (error) {
      res
        .status(400)
        .json({ message: error.details.map((err) => err.message) });
    }
    const { id } = req.params;
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
