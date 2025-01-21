import * as otpRepository from "../repositories/otpRepository.js";
import { sendOTPEmail } from "./EmailService.js";
import AppError from "../utils/AppError.js";
import { deleteOtp, getOtp } from "../utils/otpStore.js";
import { updateUser } from "../repositories/userRepository.js";

export const resendOtpCode = async (email) => {
  if (!email) {
    throw new AppError("Email is required", 400);
  }

  const existingOtp = await otpRepository.getStoredOtp(email);

  if (!existingOtp) {
    throw new AppError(
      "No OTP request found for this email. Please register first.",
      404
    );
  }

  const newOtp = Math.floor(100000 + Math.random() * 900000);

  await otpRepository.storeOtpCode(email, newOtp);
  await sendOTPEmail(email, newOtp);

  return "OTP sent successfully. Please check your email.";
};

export const verifyOtpUser = async (email, otp) => {
  const storedOtpData = await getOtp(email);

  if (!storedOtpData) {
    throw new AppError("Verification code expired or invalid", 403);
  }

  const { otp: storedOtp, expiresAt } = storedOtpData;

  if (Date.now() > expiresAt) {
    await deleteOtp(email);
    throw new AppError("Verification code expired!", 403);
  }

  if (parseInt(otp) !== storedOtp) {
    throw new AppError("Invalid verification code", 403);
  }

  await updateUser(email, { isVerified: true });
  await deleteOtp(email);
};
