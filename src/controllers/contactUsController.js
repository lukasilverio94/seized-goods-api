import AppError from "../utils/AppError.js";
import { contactUsByEmail } from "../services/EmailService.js";
import prisma from "../../prisma/client.js";

export const handlePostContactUs = async (req, res) => {
  const { userName, userEmail, subject, message } = req.body;

  try {
    await prisma.contactMessage.create({
      data: { userName, userEmail, subject, message },
    });

    await contactUsByEmail(userName, userEmail, subject, message);
    res.json({
      message:
        "Contact sent successfully! We will return to you as soon as possible! Thank you for the message!",
    });
  } catch (error) {
    console.error("Failed to send OTP email:", emailError);
    throw new AppError(
      "Could not send verification code to email. Try again later.",
      500
    );
  }
};

export const handleGetAllMessages = async (req, res, next) => {
  try {
    const messages = await prisma.contactMessage.findMany();
    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const handleGetMessageById = async (req, res, next) => {
  try {
    const { msgId } = req.params;
    const message = await prisma.contactMessage.findUnique({
      where: { id: toString(msgId) },
    });

    if (!message) {
      throw new AppError("Message not found", 404);
    }

    res.status(200).json(message);
  } catch (error) {
    next(error);
  }
};

export const handleDeleteMessage = async (req, res, next) => {
  const { msgId } = req.params;

  console.log("msgId from request params:", msgId);

  try {
    const message = await prisma.contactMessage.findUnique({
      where: { id: msgId },
    });

    console.log("Message:", message);

    if (!message) {
      return res.status(404).json({ error: "Message not found!" });
    }

    await prisma.contactMessage.delete({
      where: { id: msgId },
    });

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    next(error);
  }
};
