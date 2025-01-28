import prisma from "../../prisma/client.js";

export const createNewContactMessage = async (data) => {
  return prisma.contactMessage.create({
    data,
  });
};

export const listAllContactMessages = async () => {
  return prisma.contactMessage.findMany();
};

export const findContactMessageById = async (id) => {
  return prisma.contactMessage.findUnique({
    where: { id },
  });
};

export const deleteContactMessage = async (id) => {
  return prisma.contactMessage.delete({ where: { id } });
};

export const deleteAllContactMessages = async () => {
  return prisma.contactMessage.deleteMany({});
};
