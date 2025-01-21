import prisma from "../../prisma/client.js";

export const getAllOrganizations = async () => {
  return prisma.socialOrganization.findMany();
};

export const findOrganizationById = async (id) => {
  return prisma.socialOrganization.findUnique({ where: { id } });
};

export const findOrganizationByEmail = async (email) => {
  return prisma.socialOrganization.findUnique({ where: { email } });
};

export const createOrganization = async (data) => {
  return prisma.socialOrganization.create({ data });
};

export const updateOrganization = async (id, data) => {
  return prisma.socialOrganization.update({ where: { id }, data });
};

export const deleteOrganization = async (id) => {
  return prisma.socialOrganization.delete({ where: { id } });
};
