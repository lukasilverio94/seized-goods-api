import prisma from "../../prisma/client.js";

export const createUserWithOrganization = async (
  transaction,
  orgData,
  userData
) => {
  const organization = await transaction.socialOrganization.create({
    data: orgData,
    include: {
      categories: {
        select: {
          id: true,
          categoryId: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  const user = await transaction.user.create({
    data: userData,
  });

  return { organization, user };
};

export const findAllOrganizations = async () => {
  return prisma.socialOrganization.findMany();
};

export const findOrganizationById = async (id) => {
  return prisma.socialOrganization.findUnique({
    where: { id: parseInt(id) },
  });
};

export const findOrganizationByEmail = async (email) => {
  return prisma.socialOrganization.findUnique({ where: { email } });
};

export const createOrganization = async (data) => {
  return prisma.socialOrganization.create({
    data,
    include: {
      categories: true,
    },
  });
};

export const updateOrganizationById = async (id, data) => {
  return prisma.socialOrganization.update({
    where: { id: parseInt(id) },
    data,
  });
};

export const deleteOrganizationById = async (id) => {
  return prisma.socialOrganization.delete({
    where: { id: parseInt(id) },
  });
};
