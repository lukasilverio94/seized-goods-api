import prisma from "../../prisma/client.js";
import crypto from "node:crypto";
import bcrypt from "bcrypt";
import AppError from "../utils/AppError.js";
import {
  sendOTPEmail,
  sendResetPasswordEmail,
} from "../services/EmailService.js";
import { storeOtp, getOtp, deleteOtp } from "../utils/otpStore.js";

export const registerUser = async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    role = "USER",
    organizationId,
  } = req.body;

  try {
    const organization = await prisma.socialOrganization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new AppError("The specified organization does not exist!", 404);
    }

    // validate email uniqueness across users and organizations
    const [existingUser, existingOrganization] = await prisma.$transaction([
      prisma.user.findUnique({ where: { email } }),
      prisma.socialOrganization.findUnique({ where: { email } }),
    ]);

    if (existingUser || existingOrganization) {
      throw new AppError(
        "Email already in use for a user or organization",
        403
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // create the user and associate with the existing organization
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: role.toUpperCase(),
        isVerified: false,
        organizationId,
      },
    });

    // OTP LOGIC
    const existingOtp = await getOtp(email);
    if (existingOtp) {
      await deleteOtp(email);
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    await storeOtp(email, otp);

    // send OTP to email
    try {
      await sendOTPEmail(email, otp);
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
      throw new AppError(
        "Could not send verification code to email. Try again later.",
        500
      );
    }

    res.status(200).json({
      message:
        "User registered successfully. A verification code has been sent to your email. Please use to confirm your account.",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        organizationId: user.organizationId,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOtpUser = async (req, res, next) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      throw new AppError("Email and verification code are required", 400);
    }
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

    await prisma.user.update({
      where: { email },
      data: { isVerified: true },
    });

    await deleteOtp(email);
    res.status(200).json({ message: "Verification successful!" });
  } catch (error) {
    next(error);
  }
};

export const resendOtpCode = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new AppError("Email is required", 400);
    }

    // check if OTP exists for this email
    const existingOtpData = await getOtp(email);

    if (!existingOtpData) {
      throw new AppError(
        "No OTP request found for this email. Please register first.",
        404
      );
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000); // 6 digit OTP

    await storeOtp(email, newOtp);

    await sendOTPEmail(email, newOtp);

    res
      .status(200)
      .json({ message: "OTP send successfully. Please check your email" });
  } catch (error) {
    next(error);
  }
};

export const requestResetPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    if (!email) {
      throw new AppError("Email is required", 400);
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError("No account found with this email", 404);
    }

    const resetPassToken = crypto.randomBytes(32).toString("hex");
    const resetPassTokenExpiry = new Date(Date.now() + 3600 * 1000); // 1 hour from now

    await prisma.user.update({
      where: { email },
      data: { resetPassToken, resetPassTokenExpiry },
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetPassToken}`;
    console.log("reset link:", resetLink);
    await sendResetPasswordEmail(email, resetLink);

    res
      .status(200)
      .json({ message: "Password reset link sent. Please check your email." });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      throw new AppError("Token and a new password are required", 400);
    }

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

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: newHashedPassword,
        resetPassToken: null,
        resetPassTokenExpiry: null,
      },
    });

    res
      .status(200)
      .json({ message: "Password reset successfully. You can login now!" });
  } catch (error) {
    next(error);
  }
};

export const handleGetAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        organizationId: true,
        createdAt: true,
        updatedAt: true,
        isVerified: true,
      },
    });

    if (!users) {
      throw new AppError("Something went wrong fetching users", 400);
    }

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const handleDeleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res
        .status(404)
        .json({ error: `User with (ID) ${userId} not found!` });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    res.status(204).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const handleUpdateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, email, isVerified, role, organizationId } =
      req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        email,
        isVerified,
        role,
        organizationId,
      },
    });

    if (!updatedUser) {
      throw new AppError(
        "Something went wrong to update user: " + updatedUser.firstName,
        400
      );
    }

    res.status(201).json(updatedUser);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        error: `User with ID ${req.params.userId} not found`,
      });
    }
    next(error);
  }
};
