import prisma from "../../prisma/client.js";

export const findUserById = async (id) => {
  return prisma.user.findUnique({ where: { id } });
};

export const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      role: true,
      organizationId: true,
      isVerified: true,
    },
  });
};

export const createUser = async (data) => {
  return prisma.user.create({ data });
};

export const updateUser = async (id, data) => {
  return prisma.user.update({ where: { id }, data });
};

export const updateUserByEmail = async (email, data) => {
  return prisma.user.update({
    where: { email },
    data,
  });
};

export const findUserByResetToken = async (token) => {
  return prisma.user.findFirst({
    where: {
      resetPassToken: token,
      resetPassTokenExpiry: { gte: new Date() },
    },
  });
};

export const updateUserPassword = async (id, newPassword) => {
  return prisma.user.update({
    where: { id },
    data: {
      password: newPassword,
      resetPassToken: null,
      resetPassTokenExpiry: null,
    },
  });
};

export const deleteUser = async (id) => {
  return prisma.user.delete({ where: { id } });
};

export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      organizationId: true,
      createdAt: true,
      updatedAt: true,
      isVerified: true,
    },
  });
};
