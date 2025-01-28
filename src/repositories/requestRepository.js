import prisma from "../../prisma/client.js";

export const findRequestById = async (id) => {
  return prisma.request.findUnique({
    where: { id: parseInt(id, 10) },
    include: { seizedGood: true },
  });
};

export const findAllRequests = async () => {
  return prisma.request.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      organization: {
        select: {
          name: true,
          contactPerson: true,
        },
      },
      seizedGood: {
        select: {
          name: true,
          description: true,
        },
      },
    },
  });
};

export const findRequestsByOrganization = async (organizationId) => {
  return prisma.request.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
    include: { seizedGood: true },
  });
};

export const findPendingRequest = async (organizationId, seizedGoodId) => {
  return prisma.request.findFirst({
    where: {
      organizationId,
      seizedGoodId,
      status: "PENDING",
    },
  });
};

export const createRequest = async (data) => {
  return prisma.request.create({ data });
};

export const updateRequest = async (id, data) => {
  return prisma.request.update({
    where: { id: parseInt(id, 10) },
    data,
  });
};

export const deleteRequest = async (id) => {
  return prisma.request.delete({
    where: { id: parseInt(id, 10) },
  });
};

export const findOrganizationById = async (organizationId) => {
  return prisma.socialOrganization.findUnique({
    where: { id: organizationId },
  });
};

export const findSeizedGoodById = async (id) => {
  return prisma.seizedGood.findUnique({
    where: { id },
  });
};

export const updateSeizedGoodQuantity = async (id, quantityChange) => {
  return prisma.seizedGood.update({
    where: { id },
    data: { availableQuantity: quantityChange },
  });
};
