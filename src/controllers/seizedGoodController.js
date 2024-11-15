import prisma from "../../prisma/client.js";
import AppError from "../utils/AppError.js";
import { uploadImagesToCloudinary } from "../utils/uploadToCloudinary.js";

export const createSeizedGood = async (req, res, next) => {
  const { name, description, value } = req.body;

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

    const seizedGood = await prisma.seizedGood.create({
      data: { name, description, value: parsedValue },
    });

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
    const seizedGoods = await prisma.seizedGood.findMany({
      include: {
        images: true,
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

export const updateSeizedGood = async (req, res) => {
  const { id } = req.params;
  const { name, description, value } = req.body;
  try {
    const updatedSeizedGood = await prisma.seizedGood.update({
      where: { id: parseInt(id) },
      include: {
        images: true,
      },
      data: { name, description, value },
    });
    res.status(201).json(updatedSeizedGood);
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
