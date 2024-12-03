import prisma from "../../prisma/client.js";
import AppError from "../utils/AppError.js";

export const requestSeizedGoodItem = async (req, res, next) => {
  const { seizedGoodId, purpose, impactEstimate } = req.body;

  try {
    const { organizationId } = req.user;

    if (!organizationId) {
      throw new AppError(
        "You must belong to an organization to make a request.",
        403
      );
    }

    const organization = await prisma.socialOrganization.findUnique({
      where: { id: organizationId },
    });

    if (!organization || organization.status !== "APPROVED") {
      throw new AppError(
        "Your organization must be approved to make requests.",
        403
      );
    }

    // validate the seized good
    const good = await prisma.seizedGood.findUnique({
      where: { id: seizedGoodId },
    });

    if (!good || good.status !== "PENDING") {
      throw new AppError(
        "This seized good is not available for requests.",
        400
      );
    }

    // check for duplicate pending requests
    const existingRequest = await prisma.request.findFirst({
      where: {
        organizationId: organization.id,
        seizedGoodId,
        status: "PENDING",
      },
    });

    if (existingRequest) {
      throw new AppError(
        "A pending request for this good already exists.",
        400
      );
    }

    // create the request
    const request = await prisma.request.create({
      data: {
        organizationId: organization.id,
        seizedGoodId,
        purpose,
        impactEstimate,
      },
    });

    res.status(201).json({ message: "Request created successfully.", request });
  } catch (error) {
    next(error);
  }
};
