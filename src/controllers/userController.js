import prisma from "../../prisma/client.js";
import bcrypt from "bcrypt";
import AppError from "../utils/AppError.js";
import { sendOTPEmail } from "../config/nodemailer.js";

// IMPORTANT!!!!
// Temporary in-memory store for OTPs (use Redis or similar in production)
const otpStore = new Map();

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
    otpStore.set(email, { otp, expiresAt: Date.now() + 10 * 60 * 1000 }); //store otp temporarily

    await sendOTPEmail(email, otp);
    console.log(otp);

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
    const storedOptData = otpStore.get(email);

    if (!storedOptData) {
      throw new AppError("Verification code expired or invalid", 403);
    }

    const { otp: storedOtp, expiresAt } = storedOptData;

    if (Date.now() > expiresAt) {
      otpStore.delete(email);
      throw new AppError("Verification code expired!", 403);
    }

    if (parseInt(otp) !== storedOtp) {
      throw new AppError("Invalid verification code", 403);
    }

    await prisma.user.update({
      where: { email },
      data: { isVerified: true },
    });

    otpStore.delete(email);
    res.status(200).json({ message: "Verification successful!" });
  } catch (error) {
    next(error);
  }
};
