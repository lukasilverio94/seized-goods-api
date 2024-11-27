import { findAllSeizedGoods } from "../repositories/SeizedGoodsRepository.js";

export const getAllSeizedGoodsService = async () => {
  return findAllSeizedGoods();
};
