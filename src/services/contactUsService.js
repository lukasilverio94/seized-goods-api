import { contactUsByEmail } from "./EmailService.js";
import * as contactUsRepository from "../repositories/contactUsRepository.js";
import AppError from "../utils/AppError.js";

export const contactUsNewMessage = async (msgData) => {
  const { userName, userEmail, subject, message } = msgData;
  await contactUsRepository.createNewContactMessage(msgData);
  await contactUsByEmail(userName, userEmail, subject, message);
};

export const selectMessageById = async (msgId) => {
  if (!msgId) {
    throw new AppError("Message ID is required!", 400);
  }
  const message = await contactUsRepository.findContactMessageById(msgId);
  if (!message) {
    throw new AppError("Message not found", 404);
  }

  return message;
};

export const deleteMessageById = async (msgId) => {
  if (!msgId) {
    throw new AppError("Message ID is required!", 400);
  }
  const message = contactUsRepository.findContactMessageById(msgId);

  if (!message) {
    throw new AppError("Message not found or already deleted", 400);
  }
  await contactUsRepository.deleteContactMessage(msgId);

  return { message: "Message deleted successfully" };
};

export const deleteAllMessages = async () => {
  const messages = await contactUsRepository.listAllContactMessages();

  if (messages.length === 0) {
    throw new AppError("No messages at the moment", 404);
  }

  await contactUsRepository.deleteAllContactMessages();

  return { message: "All messages deleted successfully" };
};
