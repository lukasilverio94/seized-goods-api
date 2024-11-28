import { socialOrganizationService } from "../services/SocialOrganizationService.js";

export const createSocialOrganization = async (req, res, next) => {
  try {
    const {
      name,
      contactPerson,
      email,
      phone,
      address,
      qualifications,
      categories,
    } = req.body;

    const newOrganization =
      await socialOrganizationService.createSocialOrganization({
        name,
        contactPerson,
        email,
        phone,
        address,
        qualifications,
        categories,
      });

    res.status(201).json(newOrganization);
  } catch (error) {
    next(error);
  }
};

export const getAllSocialOrganizations = async (req, res, next) => {
  try {
    const socialOrganizations =
      await socialOrganizationService.getAllSocialOrganizations();
    res.status(200).json(socialOrganizations);
  } catch (error) {
    next(error);
  }
};

export const getSocialOrganizationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const socialOrganization =
      await socialOrganizationService.getSocialOrganizationById(id);
    res.status(200).json(socialOrganization);
  } catch (error) {
    next(error);
  }
};

export const updateSocialOrganization = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, contactPerson, email, phone, address, qualifications } =
      req.body;

    const updatedSocialOrganization =
      await socialOrganizationService.updateSocialOrganization(id, {
        name,
        contactPerson,
        email,
        phone,
        address,
        qualifications,
      });

    res.status(200).json(updatedSocialOrganization);
  } catch (error) {
    next(error);
  }
};

export const deleteSocialOrganization = async (req, res, next) => {
  try {
    const { id } = req.params;
    await socialOrganizationService.deleteSocialOrganization(id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
