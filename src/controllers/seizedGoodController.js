import prisma from "../../prisma/client.js";
import AppError from "../utils/AppError.js";
import { uploadImagesToCloudinary } from "../utils/uploadToCloudinary.js";
import { redisPublisher } from "../config/redisClient.js";

export const createSeizedGood = async (req, res, next) => {
  const { name, description, value, categoryId } = req.body;

  if (!name || !description || !value) {
    throw new AppError("All fields are required", 403);
  }

  try {
    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue)) {
      throw new AppError(
        "Invalid value for 'value' field; must be a number",
        400
      );
    }

    // Check if the category exists
    const category = await prisma.category.findUnique({
      where: { id: parseInt(categoryId) },
    });

    if (!category) {
      throw new AppError("Invalid Category ID provided", 404);
    }

    // Create the SeizedGood record without images first
    const seizedGood = await prisma.seizedGood.create({
      data: {
        name,
        description,
        value: parsedValue,
        categoryId: parseInt(categoryId),
      },
    });

    let images = [];

    // If images are provided in the request, upload them and save them in the database
    if (req.files && req.files.length > 0) {
      const imageUrls = await uploadImagesToCloudinary(req.files);

      // Save image URLs to the image table
      const imageSavePromises = imageUrls.map((url) =>
        prisma.image.create({
          data: {
            url,
            altText: "Seized Good Image",
            seizedGoodId: seizedGood.id,
          },
        })
      );

      // Wait for all images to be saved
      const savedImages = await Promise.all(imageSavePromises);

      // Attach saved images to the seizedGood record
      images = savedImages.map((img) => img.url);
    }

    // Fetch the full SeizedGood record with associated images
    const fullSeizedGood = await prisma.seizedGood.findUnique({
      where: { id: seizedGood.id },
      include: { images: true }, // Include images when fetching the full seizedGood record
    });

    // Publish the full SeizedGood (with images) to Redis
    await redisPublisher.publish(
      "newSeizedGoods",
      JSON.stringify(fullSeizedGood)
    );

    res.status(201).json(fullSeizedGood);
  } catch (error) {
    next(error);
  }
};
export const getAllSeizedGoods = async (req, res, next) => {
  try {
    const seizedGoods = await prisma.seizedGood.findMany({
      include: {
        images: true,
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(seizedGoods);
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
  const { name, description, value, categoryId } = req.body;

  try {
    const data = {};

    if (name) data.name = name;
    if (description) data.description = description;
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

export const deleteSeizedGood = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.seizedGood.delete({ where: { id: parseInt(id) } });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
