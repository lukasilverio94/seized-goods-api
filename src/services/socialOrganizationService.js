import bcrypt from "bcrypt";
import * as orgRepo from "../repositories/organizationRepository.js";
import AppError from "../utils/AppError.js";
import prisma from "../../prisma/client.js";

export const createOrganizationWithUser = async (data) => {
  const {
    name,
    contactPerson,
    email,
    firstName,
    lastName,
    phone,
    streetName,
    number,
    city,
    country,
    zipCode,
    qualifications,
    categories,
    password,
  } = data;

  const existingOrganization = await orgRepo.findOrganizationByEmail(email);
  if (existingOrganization) {
    throw new AppError(
      "The email is already in use by another organization",
      409
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.$transaction(async (tx) => {
    return orgRepo.createUserWithOrganization(
      tx,
      {
        name,
        contactPerson,
        email,
        phone,
        streetName,
        number,
        city,
        country,
        zipCode,
        qualifications,
        categories: {
          create: categories.map((categoryId) => ({
            categoryId: parseInt(categoryId),
          })),
        },
      },
      {
        email,
        firstName,
        lastName,
        password: hashedPassword,
        role: "USER",
        organizationId: null,
      }
    );
  });
};

export const createOrganization = async (data) => {
  const {
    name,
    contactPerson,
    email,
    phone,
    streetName,
    number,
    city,
    country,
    zipCode,
    qualifications,
    categories,
  } = data;

  if (!name || !email || !categories || categories.length === 0) {
    throw new AppError(
      "Name, email, and at least one category are required",
      400
    );
  }

  const existingOrganization = await orgRepo.findOrganizationByEmail(email);

  if (existingOrganization) {
    throw new AppError(
      "The email is already in use by another organization",
      409
    );
  }

  return orgRepo.createOrganization({
    name,
    contactPerson,
    email,
    phone,
    streetName,
    number,
    city,
    country,
    zipCode,
    qualifications,
    categories: {
      create: categories.map((categoryId) => ({
        categoryId: parseInt(categoryId),
      })),
    },
  });
};

export const getAllOrganizations = async () => {
  return orgRepo.findAllOrganizations();
};

export const getOrganizationById = async (id) => {
  const organization = await orgRepo.findOrganizationById(id);
  if (!organization) {
    throw new AppError("Social Organization not found.", 404);
  }
  return organization;
};

export const updateOrganization = async (id, data) => {
  const { categories, ...otherData } = data;

  const updateData = {
    ...otherData,
    ...(categories && {
      categories: {
        connect: categories.map((categoryId) => ({
          categoryId: parseInt(categoryId), // Only categoryId is required
        })),
      },
    }),
  };

  return orgRepo.updateOrganizationById(id, updateData);
};

export const deleteOrganization = async (id) => {
  const organization = await orgRepo.findOrganizationById(id);
  if (!organization) {
    throw new AppError("Social Organization not found.", 404);
  }
  await orgRepo.deleteOrganizationById(id);
};
