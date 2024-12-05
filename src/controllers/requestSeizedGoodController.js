import prisma from "../../prisma/client.js";
import AppError from "../utils/AppError.js";

export const requestSeizedGoodItem = async (req, res, next) => {
  const { seizedGoodId, purpose, impactEstimate } = req.body;

  // Convert the seizedGoodId to an integer
  const parsedSeizedGoodId = parseInt(seizedGoodId, 10);

  if (isNaN(parsedSeizedGoodId)) {
    return res.status(400).json({ error: "Invalid seized good ID" });
  }

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
      where: { id: parsedSeizedGoodId },
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
        seizedGoodId: parsedSeizedGoodId,
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
        seizedGoodId: parsedSeizedGoodId,
        purpose,
        impactEstimate,
      },
    });

    res.status(201).json({ message: "Request created successfully.", request });
  } catch (error) {
    next(error);
  }
};

export const getAllGoodsRequests = async (req, res, next) => {
  try {
    const requests = await prisma.request.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!requests) {
      throw new AppError("No requests found", 404);
    }

    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
};

export const getGoodRequestById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const request = await prisma.request.findUnique({
      where: { id: parseInt(id) },
    });

    if (!request) {
      throw new AppError("Request not found", 404);
    }

    res.status(200).json(request);
  } catch (error) {
    next(error);
  }
};

export const updateRequestGood = async (req, res, next) => {
  const { id } = req.params;
  const { seizedGoodId, purpose, impactEstimate } = req.body;

  try {
    // Convert the ID and seizedGoodId to integers
    const parsedId = parseInt(id, 10);
    const parsedSeizedGoodId = seizedGoodId ? parseInt(seizedGoodId, 10) : null;

    if (isNaN(parsedId)) {
      return res.status(400).json({ error: "Invalid request ID" });
    }

    if (parsedSeizedGoodId && isNaN(parsedSeizedGoodId)) {
      return res.status(400).json({ error: "Invalid seized good ID" });
    }

    const existingRequest = await prisma.request.findUnique({
      where: { id: parsedId },
    });

    if (!existingRequest) {
      throw new AppError("Request not found", 404);
    }

    if (parsedSeizedGoodId) {
      const good = await prisma.seizedGood.findUnique({
        where: { id: parsedSeizedGoodId },
      });

      if (!good || good.status !== "PENDING") {
        throw new AppError(
          "This seized good is not available for requests.",
          400
        );
      }
    }

    // Update the request
    const updatedRequest = await prisma.request.update({
      where: { id: parsedId },
      data: {
        ...(parsedSeizedGoodId && { seizedGoodId: parsedSeizedGoodId }),
        ...(purpose && { purpose }),
        ...(impactEstimate && { impactEstimate }),
      },
    });

    res
      .status(200)
      .json({ message: "Request updated successfully.", updatedRequest });
  } catch (error) {
    next(error);
  }
};

export const deleteGoodRequestById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const foundRequest = await prisma.request.delete({
      where: { id: parseInt(id) },
    });

    if (!foundRequest) {
      throw new AppError("Request not found!", 404);
    }

    res
      .status(201)
      .json({ message: `Request with ID(${id}) has been removed.` });
  } catch (error) {
    next(error);
  }
};
