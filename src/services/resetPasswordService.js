import crypto from "node:crypto";
import bcrypt from "bcrypt";
import AppError from "../utils/AppError.js";
import * as userRepository from "../repositories/userRepository.js";
import { sendResetPasswordEmail } from "./EmailService.js";

export const requestResetPassword = async (email) => {
  if (!email) {
    throw new AppError("Email is required", 400);
  }

  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    throw new AppError("No account found with this email", 404);
  }

  const resetPassToken = crypto.randomBytes(32).toString("hex");
  const resetPassTokenExpiry = new Date(Date.now() + 3600 * 1000); // 1 hour from now

  await userRepository.updateUserByEmail(email, {
    resetPassToken,
    resetPassTokenExpiry,
  });

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetPassToken}`;
  await sendResetPasswordEmail(email, resetLink);

  return "Password reset link sent. Please check your email.";
};

export const resetPassword = async (token, newPassword) => {
  if (!token || !newPassword) {
    throw new AppError("Token and a new password are required", 400);
  }

  const user = await userRepository.findUserByResetToken(token);

  if (!user) {
    throw new AppError("Invalid or expired reset token", 400);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await userRepository.updateUserPassword(user.id, hashedPassword);

  return "Password reset successfully. You can login now!";
};
