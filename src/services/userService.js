import bcrypt from "bcrypt";
import crypto from "node:crypto";
import AppError from "../utils/AppError.js";
import * as userRepository from "../repositories/userRepository.js";
import * as organizationRepository from "../repositories/organizationRepository.js";
import { storeOtp } from "../utils/otpStore.js";
import { sendOTPEmail, sendResetPasswordEmail } from "./EmailService.js";
import prisma from "../../prisma/client.js";

export const registerUser = async (userData) => {
  const {
    firstName,
    lastName,
    email,
    password,
    role = "USER",
    organizationId,
  } = userData;

  const organization = await organizationRepository.findOrganizationById(
    organizationId
  );

  if (!organization) {
    throw new AppError("The specified organization does not exist!", 404);
  }

  const [existingUser, existingOrganization] = await Promise.all([
    userRepository.findUserByEmail(email),
    organizationRepository.findOrganizationByEmail(email),
  ]);

  if (existingUser || existingOrganization) {
    throw new AppError("Email already in use for a user or organization", 403);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userRepository.createUser({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role: role.toUpperCase(),
    isVerified: false,
    organizationId,
  });

  const otp = Math.floor(100000 + Math.random() * 900000);
  await storeOtp(email, otp);
  await sendOTPEmail(email, otp);

  return user;
};

export const requestPasswordReset = async (email) => {
  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    throw new AppError("No account found with this email", 404);
  }

  const resetPassToken = crypto.randomBytes(32).toString("hex");
  const resetPassTokenExpiry = new Date(Date.now() + 3600 * 1000);

  await userRepository.updateUser(user.id, {
    resetPassToken,
    resetPassTokenExpiry,
  });

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetPassToken}`;
  await sendResetPasswordEmail(email, resetLink);
};

export const resetPassword = async (token, newPassword) => {
  const user = await prisma.user.findFirst({
    where: {
      resetPassToken: token,
      resetPassTokenExpiry: { gte: new Date() },
    },
  });

  if (!user) {
    throw new AppError("Invalid or expired reset token", 400);
  }

  const newHashedPassword = await bcrypt.hash(newPassword, 10);

  await userRepository.updateUser(user.id, {
    password: newHashedPassword,
    resetPassToken: null,
    resetPassTokenExpiry: null,
  });
};

export const getAllUsers = async () => {
  try {
    const users = await userRepository.getAllUsers();
    if (!users) {
      throw new AppError("Something went wrong fetching users", 400);
    }
    return users;
  } catch (error) {
    console.log(error);
  }
};

export const deleteUser = async (userId) => {
  const user = await userRepository.findUserById(userId);

  if (!user) {
    throw new AppError(`User with (ID) ${userId} not found!`, 404);
  }

  await userRepository.deleteUser(userId);
};
