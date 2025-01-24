import * as orgService from "../services/socialOrganizationService.js";

export const handleCreateOrganizationWithUser = async (req, res, next) => {
  try {
    const newOrganization = await orgService.createOrganizationWithUser(
      req.body
    );
    res.status(201).json({
      message: "Registration successful. Your account is pending approval.",
      organization: newOrganization.organization,
      user: {
        email: newOrganization.user.email,
        role: newOrganization.user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const handleCreateOrganization = async (req, res, next) => {
  try {
    const newOrganization = await orgService.createOrganization(req.body);
    res.status(201).json(newOrganization);
  } catch (error) {
    next(error);
  }
};

export const handleGetAllOrganizations = async (req, res, next) => {
  try {
    const organizations = await orgService.getAllOrganizations();
    res.status(200).json(organizations);
  } catch (error) {
    next(error);
  }
};

export const handleGetOrganizationById = async (req, res, next) => {
  try {
    const organization = await orgService.getOrganizationById(req.params.id);
    res.status(200).json(organization);
  } catch (error) {
    next(error);
  }
};

export const handleUpdateOrganization = async (req, res, next) => {
  try {
    const updatedOrganization = await orgService.updateOrganization(
      req.params.id,
      req.body
    );
    res.status(200).json(updatedOrganization);
  } catch (error) {
    next(error);
  }
};

export const handleDeleteOrganization = async (req, res, next) => {
  try {
    await orgService.deleteOrganization(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
