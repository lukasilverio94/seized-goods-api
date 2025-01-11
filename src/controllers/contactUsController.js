import AppError from "../utils/AppError.js";
import { contactUsByEmail } from "../services/EmailService.js";
import prisma from "../../prisma/client.js";

export const contactUs = async (req, res) => {
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
