import prisma from "../prisma/client.js";

export const createSocialOrganization = async (req, res) => {
  const { name, contactPerson, email, phone, address, qualifications } =
    req.body;
  try {
    const organization = await prisma.socialOrganization.create({
      data: { name, contactPerson, email, phone, address, qualifications },
    });
    res.status(201).json(organization);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
