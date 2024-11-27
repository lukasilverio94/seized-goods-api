import {
  findSeizedGoodById,
  deleteSeizedGoodById,
} from "../repositories/SeizedGoodsRepository.js";
import AppError from "../utils/AppError.js";

export const deleteSeizedGoodService = async (id) => {
  const seizedGood = await findSeizedGoodById(id);

  if (!seizedGood) {
    throw new AppError("Seized good not found", 403);
  }

  return deleteSeizedGoodById(id);
};
