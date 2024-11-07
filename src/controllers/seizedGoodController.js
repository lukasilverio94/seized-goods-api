import prisma from "../../prisma/client.js";
import AppError from "../utils/AppError.js";

export const createSeizedGood = async (req, res, next) => {
  const { name, description, value } = req.body;

  if (!name || !description || !value) {
    throw new AppError("All fields are required", 403);
  }
  try {
    const seizedGood = await prisma.seizedGood.create({
      data: {
        name,
        description,
        value,
      },
    });

    res.status(201).json(seizedGood);
  } catch (error) {
    next(error);
  }
};

export const getAllSeizedGoods = async (req, res) => {
  try {
    const seizedGoods = await prisma.seizedGood.findMany();
    res.status(201).json(seizedGoods);
  } catch (error) {
    next(error);
  }
};

export const getSeizedGoodById = async (req, res) => {
  const { id } = req.params;
  try {
    const seizedGood = await prisma.seizedGood.findUnique({
      where: { id: parseInt(id) },
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
