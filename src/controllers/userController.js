import prisma from "../../prisma/client.js";
import crypto from "node:crypto";
import bcrypt from "bcrypt";
import AppError from "../utils/AppError.js";
import { sendOTPEmail, sendResetPasswordEmail } from "../config/nodemailer.js";
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
      throw new AppError("Organization not found!", 404);
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      throw new AppError("Email already taken", 403);
    }

    const existingOrganization = await prisma.socialOrganization.findUnique({
      where: { id: organizationId },
    });

    if (!existingOrganization) {
      throw new AppError("The specified organization does not exist", 404);
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

    // generate and send OTP CODE
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log(otp);
    // store otp on redis
    await storeOtp(email, otp);

    await sendOTPEmail(email, otp);

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
