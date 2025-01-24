import AppError from "../utils/AppError.js";
import { findOrganizationById } from "../repositories/organizationRepository.js";
import { findSeizedGoodById } from "../repositories/seizedGoodRepository.js";
import * as feedbackRepository from "../repositories/feedbackRepository.js";

export const addFeedback = async (fdData) => {
  const { organizationId, seizedGoodId, testimonial, impactStats } = fdData;

  const organization = await findOrganizationById(organizationId);

  if (!organization) {
    throw new AppError("Organization not found", 404);
  }

  const seizedGoodItem = await findSeizedGoodById(seizedGoodId);

  if (!seizedGoodItem) {
    throw new AppError("Item not found!", 404);
  }

  const feedback = await feedbackRepository.createFeedback({
    organizationId,
    seizedGoodId,
    testimonial,
    impactStats,
  });

  return feedback;
};

export const getFeedbackById = async (fbId) => {
  const feedback = await feedbackRepository.listFeedback(parseInt(fbId, 10));

  if (!feedback) {
    throw new AppError(`Feedback with ID ${fbId} not found.`, 404);
  }

  return feedback;
};

export const getAllFeedbacks = async () => {
  const feedbacks = await feedbackRepository.listAllFeedbacks();
  return feedbacks;
};

export const updateFeedback = async (fbId, fbData) => {
  const { organizationId, seizedGoodId, testimonial, impactStats } = fbData;

  const organization = await findOrganizationById(organizationId);

  if (!organization) {
    throw new AppError("Organization not found", 404);
  }

  const seizedGoodItem = await findSeizedGoodById(seizedGoodId);

  if (!seizedGoodItem) {
    throw new AppError("Seized good not found", 404);
  }

  const foundFeedback = await feedbackRepository.listFeedback(parseInt(fbId));
  if (!foundFeedback) {
    throw new AppError("Feedback not found", 404);
  }

  const updatedFeedback = await feedbackRepository.updateFeedBack(
    parseInt(fbId),
    {
      organizationId,
      seizedGoodId,
      testimonial,
      impactStats,
    }
  );

  return updatedFeedback;
};

export const deleteFeedback = async (fbId) => {
  const feedback = await feedbackRepository.listFeedback(parseInt(fbId, 10));
  if (!feedback) {
    throw new AppError("Feedback not found", 404);
  }
  await feedbackRepository.deleteFeedback(parseInt(fbId, 10));

  return { message: `Feedback ${fbId} has been removed` };
};
