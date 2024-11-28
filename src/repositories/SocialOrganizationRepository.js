import prisma from "../../prisma/client.js";

export const findSocialOrganizationById = async (id) => {
  return prisma.socialOrganization.findUnique({
    where: { id: parseInt(id) },
    include: { categories: true },
  });
};

export const findAllSocialOrganizations = async () => {
  return prisma.socialOrganization.findMany({
    orderBy: { createdAt: "desc" },
    include: { categories: true },
  });
};

export const createSocialOrganization = async (data) => {
  return prisma.socialOrganization.create({
    data,
    include: { categories: true },
  });
};

export const updateSocialOrganization = async (id, data) => {
  return prisma.socialOrganization.update({
    where: { id: parseInt(id) },
    data,
    include: { categories: true },
  });
};

export const deleteSocialOrganization = async (id) => {
  return prisma.socialOrganization.delete({
    where: { id: parseInt(id) },
  });
};
