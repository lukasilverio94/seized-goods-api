import prisma from "../../prisma/client.js";
import AppError from "../utils/AppError.js";

export const requestSeizedGoodItem = async (req, res, next) => {
  const { seizedGoodId, quantity, purpose, impactEstimate } = req.body;

  try {
    const { organizationId } = req.user;

    if (!organizationId) {
      throw new AppError(
        "You must belong to an organization to make a request.",
        403
      );
    }

    if (!quantity || quantity <= 0) {
      return res
        .status(400)
        .json({ error: "Quantity must be greater than zero" });
    }

    //check social org.
    const organization = await prisma.socialOrganization.findUnique({
      where: { id: organizationId },
    });

    if (!organization || organization.status !== "APPROVED") {
      throw new AppError(
        "Your organization must be approved to make requests.",
        403
      );
    }

    const good = await prisma.seizedGood.findUnique({
      where: { id: seizedGoodId },
    });

    if (!good || good.status !== "PENDING") {
      throw new AppError(
        "This seized good is not available for requests.",
        400
      );
    }

    if (quantity > good.availableQuantity) {
      throw new AppError(
        `Requested quantity exceeds available stock. Only ${good.availableQuantity} available.`,
        400
      );
    }

    //check for duplicate pending requests for this organization and good
    const existingRequest = await prisma.request.findFirst({
      where: {
        organizationId,
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

    //create request and update available quantity atomically
    const result = await prisma.$transaction(async (tx) => {
      // Update available quantity
      await tx.seizedGood.update({
        where: { id: seizedGoodId },
        data: { availableQuantity: { decrement: quantity } },
      });

      // create the request for this good
      const request = await tx.request.create({
        data: {
          organizationId,
          seizedGoodId,
          quantity,
          purpose,
          impactEstimate,
        },
      });

      return request;
    });

    res
      .status(201)
      .json({ message: "Request created successfully.", request: result });
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
  const { seizedGoodId, purpose, impactEstimate, quantity } = req.body;

  try {
    const requestId = parseInt(id, 10);
    const parsedSeizedGoodId = seizedGoodId ? parseInt(seizedGoodId, 10) : null;

    if (isNaN(requestId)) {
      return res.status(400).json({ error: "Invalid request ID" });
    }

    const existingRequest = await prisma.request.findUnique({
      where: { id: requestId },
    });

    if (!existingRequest) {
      throw new AppError("Request not found", 404);
    }

    if (parsedSeizedGoodId && isNaN(parsedSeizedGoodId)) {
      return res.status(400).json({ error: "Invalid seized good ID" });
    }

    const good = await prisma.seizedGood.findUnique({
      where: { id: parsedSeizedGoodId || existingRequest.seizedGoodId },
    });

    if (quantity > good.availableQuantity + existingRequest.quantity) {
      throw new AppError(
        `Requested quantity exceeds available stock. Only ${
          good.availableQuantity + existingRequest.quantity
        } items can be requested.`,
        400
      );
    }

    // adjust qty on inventory
    await prisma.seizedGood.update({
      where: { id: parsedSeizedGoodId || existingRequest.seizedGoodId },
      data: {
        availableQuantity:
          good.availableQuantity + existingRequest.quantity - quantity,
      },
    });

    // update the request
    const updatedRequest = await prisma.request.update({
      where: { id: requestId },
      data: {
        ...(parsedSeizedGoodId && { seizedGoodId: parsedSeizedGoodId }),
        ...(purpose && { purpose }),
        ...(impactEstimate && { impactEstimate }),
        ...(quantity && { quantity }),
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

    //return the quantity to inventory
    await prisma.seizedGood.update({
      where: { id: foundRequest.seizedGoodId },
      data: {
        availableQuantity: {
          increment: foundRequest.quantity,
        },
      },
    });

    res
      .status(201)
      .json({ message: `Request with ID(${id}) has been removed.` });
  } catch (error) {
    next(error);
  }
};

export const approveRequest = async (req, res, next) => {
  const { id } = req.params;

  try {
    const requestId = parseInt(id);

    if (isNaN(requestId)) {
      return res.status(400).json({ error: "Invalid Request ID" });
    }

    const request = await prisma.request.findUnique({
      where: { id: requestId },
      include: { seizedGood: true },
    });

    if (!request) {
      throw new AppError("Request not found", 404);
    }

    if (request.status !== "PENDING") {
      throw new AppError(
        `Request is already ${request.status}. Only PENDING requests can be approved!`,
        400
      );
    }

    const seizedGood = request.seizedGood;

    if (request.quantity > seizedGood.availableQuantity + request.quantity) {
      throw new AppError(
        `Insufficient stock. Only ${seizedGood.availableQuantity} items are available.`,
        400
      );
    }

    const approvedRequest = await prisma.request.update({
      where: { id: requestId },
      data: { status: "APPROVED" },
    });

    res.status(200).json({
      message: "Request approved successfully.",
      request: approvedRequest,
    });
  } catch (error) {
    next(error);
  }
};
