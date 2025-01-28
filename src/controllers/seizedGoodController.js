import prisma from "../../prisma/client.js";
import { sseClients } from "../events/serverSentEvents.js";
import { uploadImagesToCloudinary } from "../utils/uploadToCloudinary.js";
import AppError from "../utils/AppError.js";
import * as seizedGoodService from "../services/seizedGoodService.js";
import * as seizedGoodRepository from "../repositories/seizedGoodRepository.js";

export const handleRegisterItem = async (req, res, next) => {
  try {
    const seizedGood = await seizedGoodService.registerSeizedGood(
      req.body,
      req.files
    );
    res.status(201).json(seizedGood);
  } catch (error) {
    next(error);
  }
};

export const handleGetAllSeizedGoods = async (req, res, next) => {
  try {
    const { categoryId, searchTerm, page = 1, limit } = req.query;

    const filters = {};

    if (categoryId) {
      filters.categoryId = parseInt(categoryId, 10);
    }
    if (searchTerm) {
      filters.name = {
        contains: searchTerm,
        mode: "insensitive",
      };
    }
    const seizedGoods = await seizedGoodService.getAllSeizedGoods(
      filters,
      page,
      limit
    );

    return res.status(200).json(seizedGoods);
  } catch (error) {
    next(error);
  }
};

export const handleGetSeizedGoodById = async (req, res, next) => {
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

export const handleUpdateSeizedGood = async (req, res, next) => {
  const { id } = req.params;
  const { name, description, value, quantity, categoryId } = req.body;
  const files = req.files;

  try {
    const data = {};

    if (name) {
      data.name = name;
    }
    if (description) {
      data.description = description;
    }
    if (quantity) {
      data.quantity = parseInt(quantity, 10);
    }
    if (value) {
      data.value = parseFloat(value);
    }

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

     if (files && files.length > 0) {
        const imageUrls = await uploadImagesToCloudinary(files);
        await Promise.all(
        imageUrls.map((url) =>
        seizedGoodRepository.saveImage({
          url,
          altText: "Seized Good Image",
          seizedGoodId: updatedSeizedGood.id,
        })
      )
    );
  }


    res.status(200).json(updatedSeizedGood);
  } catch (error) {
    next(error);
  }
};

export const handleDeleteSeizedGood = async (req, res, next) => {
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
