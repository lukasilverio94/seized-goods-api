import prisma from "../../prisma/client.js";

export const findSeizedGoodById = async (id) => {
  return prisma.seizedGood.findUnique({
    where: { id: parseInt(id) },
    include: {
      images: true,
      category: true,
    },
  });
};

export const findAllSeizedGoods = async () => {
  return prisma.seizedGood.findMany({
    include: {
      images: true,
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const createSeizedGood = async (data) => {
  return prisma.seizedGood.create({ data });
};

export const updateSeizedGoodById = async (id, data) => {
  return prisma.seizedGood.update({
    where: { id: parseInt(id) },
    data,
    include: {
      images: true,
      category: true,
    },
  });
};

export const deleteSeizedGoodById = async (id) => {
  return prisma.seizedGood.delete({
    where: { id: parseInt(id) },
  });
};
