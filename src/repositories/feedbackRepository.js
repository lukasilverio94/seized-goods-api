import prisma from "../../prisma/client.js";

export const createFeedback = async (data) => {
  return prisma.feedback.create({ data });
};

export const listFeedback = async (id) => {
  return prisma.feedback.findUnique({ where: { id } });
};

export const listAllFeedbacks = async () => {
  return prisma.feedback.findMany();
};

export const updateFeedBack = async (id, data) => {
  return prisma.feedback.update({ where: { id }, data });
};
export const deleteFeedback = async (id) => {
  return prisma.feedback.delete({ where: { id } });
};
