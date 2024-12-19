import prisma from "../../prisma/client.js";
import AppError from "../utils/AppError.js";

export const addFeedback = async (req, res, next) => {
  try {
    const { organizationId, seizedGoodId, testimonial, impactStats } = req.body;

    const organization = await prisma.socialOrganization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new AppError("Organization not found", 404);
    }

    const seizedGood = await prisma.seizedGood.findUnique({
      where: { id: seizedGoodId },
    });

    if (!seizedGood) {
      throw new AppError("Seized good not found", 404);
    }

    const feedback = await prisma.feedback.create({
      data: {
        organizationId,
        seizedGoodId,
        testimonial,
        impactStats,
      },
    });

    res.status(200).json(feedback);
  } catch (error) {
    next(error);
  }
};

export const getAllFeedbacks = async (req, res, next) => {
  try {
    const feedbacks = await prisma.feedback.findMany();
    res.status(200).json(feedbacks);
  } catch (error) {
    next(error);
  }
};

export const updateFeedback = async (req, res, next) => {
  try {
    const { feedbackId } = req.params;
    const { organizationId, seizedGoodId, testimonial, impactStats } = req.body;

    const organization = await prisma.socialOrganization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new AppError("Organization not found", 404);
    }

    const seizedGood = await prisma.seizedGood.findUnique({
      where: { id: seizedGoodId },
    });

    if (!seizedGood) {
      throw new AppError("Seized good not found", 404);
    }

    const updatedFeedback = await prisma.feedback.update({
      where: { id: parseInt(feedbackId) },
      data: {
        organizationId,
        seizedGoodId,
        testimonial,
        impactStats,
      },
    });

    res.status(200).json(updatedFeedback);
  } catch (error) {
    next(error);
  }
};

export const deleteFeedback = async (req, res, next) => {
  try {
    const { feedbackId } = req.params;

    await prisma.feedback.delete({
      where: { id: parseInt(feedbackId) },
    });

    res.status(204).json({ message: "Feedback deleted successfully" });
  } catch (error) {
    next(error);
  }
};
