import {
  findSocialOrganizationById,
  findAllSocialOrganizations,
  createSocialOrganization,
  updateSocialOrganization,
  deleteSocialOrganization,
} from "../repositories/SocialOrganizationRepository.js";
import AppError from "../utils/AppError.js";

export const socialOrganizationService = {
  async createSocialOrganization({
    name,
    contactPerson,
    email,
    phone,
    address,
    qualifications,
    categories,
  }) {
    if (!name || !email || !categories || categories.length === 0) {
      throw new AppError(
        "Name, email, and at least one category are required",
        400
      );
    }

    const organizationData = {
      name,
      contactPerson,
      email,
      phone,
      address,
      qualifications,
      categories: {
        create: categories.map((categoryId) => ({
          categoryId: parseInt(categoryId),
        })),
      },
    };

    return await createSocialOrganization(organizationData);
  },

  async getAllSocialOrganizations() {
    return await findAllSocialOrganizations();
  },

  async getSocialOrganizationById(id) {
    const socialOrganization = await findSocialOrganizationById(id);
    if (!socialOrganization) {
      throw new AppError(`Social Organization with ID ${id} not found`, 404);
    }
    return socialOrganization;
  },

  async updateSocialOrganization(id, data) {
    const existingOrganization = await findSocialOrganizationById(id);
    if (!existingOrganization) {
      throw new AppError(`Social Organization with ID ${id} not found`, 404);
    }

    return await updateSocialOrganization(id, data);
  },

  async deleteSocialOrganization(id) {
    const existingOrganization = await findSocialOrganizationById(id);
    if (!existingOrganization) {
      throw new AppError(`Social Organization with ID ${id} not found`, 404);
    }

    return await deleteSocialOrganization(id);
  },
};
