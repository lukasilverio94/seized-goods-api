import prisma from "../../prisma/client.js";
import AppError from "../utils/AppError.js";

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    throw new AppError("Category name is required", 400);
  }

  try {
    const category = await prisma.category.create({
      data: { name },
    });
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};
