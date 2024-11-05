import prisma from "../../prisma/client.js";

export const createSocialOrganization = async (req, res) => {
  const { name, contactPerson, email, phone, address, qualifications } =
    req.body;
  try {
    const organization = await prisma.socialOrganization.create({
      data: { name, contactPerson, email, phone, address, qualifications },
    });
    res.status(201).json(organization);
  } catch (error) {
    next(error);
  }
};

export const getAllSocialOrganizations = async (req, res, next) => {
  try {
    const socialOrganizations = await prisma.socialOrganization.findMany();
    res.status(201).json(socialOrganizations);
  } catch (error) {
    res.status(404).json({ message: "Problem to find organizations" });
    next(error);
  }
};

export const getSocialOrganizationById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const socialOrganization = await prisma.socialOrganization.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    res.status(201).json(socialOrganization);
  } catch (error) {
    next(error);
  }
};

export const updateSocialOrganization = async (req, res, next) => {
  const { id } = req.params;
  const { name, contactPerson, email, phone, address, qualifications } =
    req.body;
  try {
    const updatedSocialOrganization = await prisma.socialOrganization.update({
      where: {
        id: parseInt(id),
      },
      data: { name, contactPerson, email, phone, address, qualifications },
    });

    res.status(201).json(updatedSocialOrganization);
  } catch (error) {
    next(error);
  }
};

export const deleteSocialOrganization = async (req, res, next) => {
  const { id } = req.params;

  try {
    await prisma.socialOrganization.delete({ where: { id: parseInt(id) } });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
