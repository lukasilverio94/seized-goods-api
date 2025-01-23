import AppError from "../utils/AppError.js";
import * as contactUsService from "../services/contactUsService.js";
import { listAllContactMessages } from "../repositories/contactUsRepository.js";

export const handlePostContactUs = async (req, res) => {
  try {
    await contactUsService.contactUsNewMessage(req.body);
    res.json({
      message:
        "Contact sent successfully! We will return to you as soon as possible! Thank you for the message!",
    });
  } catch (error) {
    throw new AppError(
      "Could not send verification code to email:",
      error,
      500
    );
  }
};

export const handleGetAllMessages = async (req, res, next) => {
  try {
    const messages = await listAllContactMessages();
    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

export const handleGetMessageById = async (req, res, next) => {
  try {
    const message = await contactUsService.selectMessageById(req.params.msgId);
    res.status(200).json(message);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const handleDeleteMessage = async (req, res, next) => {
  try {
    const response = await contactUsService.deleteMessageById(req.params.msgId);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error deleting message:", error);
    next(error);
  }
};

export const handleDeleteAllMessages = async (req, res, next) => {
  try {
    const response = await contactUsService.deleteAllMessages();
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
