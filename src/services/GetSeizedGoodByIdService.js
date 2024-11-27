import { findSeizedGoodById } from "../repositories/SeizedGoodsRepository.js";
import AppError from "../utils/AppError.js";

export const getSeizedGoodByIdService = async (id) => {
  const seizedGood = await findSeizedGoodById(id);

  if (!seizedGood) {
    throw new AppError("Seized good not found!", 404);
  }

  return seizedGood;
};
