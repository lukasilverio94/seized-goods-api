import {
  findRequestById,
  findAllRequests,
  findRequestsByOrganization,
  findPendingRequest,
  updateRequest,
  deleteRequest,
  findOrganizationById,
  findSeizedGoodById,
  updateSeizedGoodQuantity,
} from "../repositories/requestRepository.js";
import { broadcastRequestsToAdmin } from "../events/serverSentEvents.js";
import AppError from "../utils/AppError.js";
import prisma from "../../prisma/client.js";

export const requestSeizedGoodItem = async (user, body) => {
  const { seizedGoodId, quantity, purpose, impactEstimate } = body;
  const { organizationId } = user;

  if (!organizationId) {
    throw new AppError(
      "You must belong to an organization to make a request.",
      403
    );
  }

  if (!quantity || quantity <= 0) {
    throw new AppError("Quantity must be greater than zero", 400);
  }

  const organization = await findOrganizationById(organizationId);

  if (!organization || organization.status !== "APPROVED") {
    throw new AppError(
      "Your organization must be approved to make requests.",
      403
    );
  }

  const good = await findSeizedGoodById(seizedGoodId);

  if (!good || good.status !== "PENDING") {
    throw new AppError("This seized good is not available for requests.", 400);
  }

  if (quantity > good.availableQuantity) {
    throw new AppError(
      `Requested quantity exceeds available stock. Only ${good.availableQuantity} available.`,
      400
    );
  }

  const existingRequest = await findPendingRequest(
    organizationId,
    seizedGoodId
  );

  if (existingRequest) {
    throw new AppError("A pending request for this good already exists.", 400);
  }

  // Perform the transaction
  return prisma.$transaction(async (tx) => {
    // Update available quantity within the transaction
    await tx.seizedGood.update({
      where: { id: seizedGoodId },
      data: { availableQuantity: { decrement: quantity } },
    });

    // Create the request within the transaction
    const request = await tx.request.create({
      data: {
        organizationId,
        seizedGoodId,
        quantity,
        purpose,
        impactEstimate,
      },
    });

    const notification = {
      type: "new_request_item",
      requestId: request.id,
      organizationId: request.organizationId,
      seizedGoodId: request.seizedGoodId,
      quantity: request.quantity,
      purpose: request.purpose,
      impactEstimate: request.impactEstimate,
    };

    broadcastRequestsToAdmin(notification);

    return request;
  });
};

export const getAllGoodsRequests = async () => {
  const requests = await findAllRequests();

  if (!requests || requests.length === 0) {
    throw new AppError("No requests found", 404);
  }

  return requests;
};

export const getGoodRequestById = async (id) => {
  if (!id || isNaN(id)) {
    throw new AppError("Invalid or missing ID", 400);
  }

  const request = await findRequestById(id);

  if (!request) {
    throw new AppError("Request not found", 404);
  }

  return request;
};

export const getUserRequests = async (organizationId) => {
  if (!organizationId) {
    throw new AppError("User is not associated with an organization", 403);
  }

  const requests = await findRequestsByOrganization(organizationId);

  if (!requests.length) {
    throw new AppError("No requests found", 404);
  }

  return requests;
};

export const updateRequestGood = async (id, data) => {
  const { seizedGoodId, purpose, impactEstimate, quantity } = data;

  const requestId = parseInt(id, 10);
  const parsedSeizedGoodId = seizedGoodId ? parseInt(seizedGoodId, 10) : null;

  if (isNaN(requestId)) {
    throw new AppError("Invalid request ID", 400);
  }

  // Fetch the existing request
  const existingRequest = await prisma.request.findUnique({
    where: { id: requestId },
  });

  if (!existingRequest) {
    throw new AppError("Request not found", 404);
  }

  // Fetch the seized good
  const good = await prisma.seizedGood.findUnique({
    where: { id: parsedSeizedGoodId || existingRequest.seizedGoodId },
  });

  if (!good) {
    throw new AppError("Seized good not found", 404);
  }

  // Ensure the new quantity does not exceed available stock
  if (quantity > good.availableQuantity + existingRequest.quantity) {
    throw new AppError(
      `Requested quantity exceeds available stock. Only ${
        good.availableQuantity + existingRequest.quantity
      } items can be requested.`,
      400
    );
  }

  // Perform the inventory adjustment and request update atomically
  return prisma.$transaction(async (tx) => {
    // Adjust inventory quantity
    await tx.seizedGood.update({
      where: { id: parsedSeizedGoodId || existingRequest.seizedGoodId },
      data: {
        availableQuantity:
          good.availableQuantity + existingRequest.quantity - quantity,
      },
    });

    // Update the request details
    return tx.request.update({
      where: { id: requestId },
      data: {
        ...(parsedSeizedGoodId && { seizedGoodId: parsedSeizedGoodId }),
        ...(purpose && { purpose }),
        ...(impactEstimate && { impactEstimate }),
        ...(quantity && { quantity }),
      },
    });
  });
};

export const deleteGoodRequestById = async (id) => {
  const foundRequest = await findRequestById(id);

  if (!foundRequest) {
    throw new AppError("Request not found!", 404);
  }

  const request = await deleteRequest(id);

  await updateSeizedGoodQuantity(request.seizedGoodId, {
    increment: request.quantity,
  });

  return request;
};

export const approveRequest = async (id) => {
  const request = await findRequestById(id);

  if (!request) {
    throw new AppError("Request not found", 404);
  }

  if (request.status !== "PENDING") {
    throw new AppError(
      `Request is already ${request.status}. Only PENDING requests can be approved!`,
      400
    );
  }

  return updateRequest(id, { status: "APPROVED" });
};
