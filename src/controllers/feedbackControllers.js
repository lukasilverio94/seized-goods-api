import * as feedbackService from "../services/feedbackService.js";

export const handlePostFeedback = async (req, res, next) => {
  try {
    const feedback = await feedbackService.addFeedback(req.body);
    res.status(200).json(feedback);
  } catch (error) {
    next(error);
  }
};

export const handleGetAllFeedbacks = async (req, res, next) => {
  try {
    const feedbacks = await feedbackService.getAllFeedbacks();
    res.status(200).json(feedbacks);
  } catch (error) {
    next(error);
  }
};

export const handleGetFeedback = async (req, res, next) => {
  try {
    const feedback = await feedbackService.getFeedbackById(req.params.fbId);
    res.status(200).json(feedback);
  } catch (error) {
    next(error);
  }
};

export const handleUpdateFeedback = async (req, res, next) => {
  try {
    const updatedFeedback = await feedbackService.updateFeedback(
      req.params.fbId,
      req.body
    );
    res.status(200).json(updatedFeedback);
  } catch (error) {
    next(error);
  }
};

export const handleDeleteFeedback = async (req, res, next) => {
  try {
    const response = await feedbackService.deleteFeedback(req.params.fbId);
    res.status(204).json(response);
  } catch (error) {
    next(error);
  }
};
