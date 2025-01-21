import prisma from "../../prisma/client.js";

export const createSeizedGood = async (data) => {
  return prisma.seizedGood.create({ data });
};

export const findSeizedGoodById = async (id) => {
  return prisma.seizedGood.findUnique({
    where: { id: parseInt(id, 10) },
    include: {
      images: true,
      category: true,
    },
  });
};

export const findSeizedGoods = async (filters, pagination, orderBy) => {
  return prisma.seizedGood.findMany({
    where: filters,
    include: {
      images: true,
      category: true,
    },
    ...pagination,
    orderBy,
  });
};

export const updateSeizedGood = async (id, data) => {
  return prisma.seizedGood.update({
    where: { id: parseInt(id, 10) },
    data,
    include: {
      images: true,
      category: true,
    },
  });
};

export const deleteSeizedGoodById = async (id) => {
  return prisma.seizedGood.delete({
    where: { id: parseInt(id, 10) },
  });
};

export const findCategoryById = async (id) => {
  return prisma.category.findUnique({ where: { id: parseInt(id, 10) } });
};

export const saveImage = async (data) => {
  return prisma.image.create({ data });
};
