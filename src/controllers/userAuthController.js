import prisma from "../../prisma/client.js";
import bcrypt from "bcrypt";
import { randomUUID } from "node:crypto";
import AppError from "../utils/AppError.js";
import { generateTokens } from "../utils/jwt.js";
import { addRefreshTokenToWhiteList } from "../services/refreshTokens.js";
import { setAuthCookies, clearAuthCookies } from "../utils/setAuthCookies.js";
import { isEmailValidate } from "../utils/isEmailValidate.js";
import { validateUserInputs } from "../utils/validateUserInputs.js";
import { sendOTPEmail } from "../services/emailService.js";
import { storeOtp, getOtp, deleteOtp } from "../utils/otpStore.js";

export const registerUser = async (req, res, next) => {
  const { username, email, password, role = "USER" } = req.body;

  try {
    validateUserInputs({ username, email, password });
    if (!isEmailValidate(email)) {
      throw new AppError("This is not a valid email. Try again!");
    }

    if (!username || !email || !password) {
      throw new AppError("All fields are required", 403);
    }

    const isUsernameAlreadyRegistered = await prisma.user.findUnique({
      where: { username: username },
    });

    if (isUsernameAlreadyRegistered) {
      throw new AppError("Username already taken", 403);
    }

    const isEmailAlreadyRegistered = await prisma.user.findUnique({
      where: { email: email },
    });

    if (isEmailAlreadyRegistered) {
      throw new AppError("Email already taken", 403);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: role.toUpperCase(),
        isVerified: false,
      },
    });
    // generate 6 digit otp code
    const otp = Math.floor(100000 + Math.random() * 900000);

    // store OTP in Redis
    await storeOtp(email, otp);

    await sendOTPEmail(email, otp);
    // Generate tokens and store refresh token in whitelist
    const jti = randomUUID();
    const { accessToken, refreshToken } = generateTokens(user, jti);
    await addRefreshTokenToWhiteList({ jti, refreshToken, userId: user.id });

    setAuthCookies(res, accessToken, refreshToken);

    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
};

// VERIFY OTP CODE
export const verifyOtpUser = async (req, res, next) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      throw new AppError("Email and Verification Code are required", 400);
    }

    const storedOtpData = await getOtp(email);
    if (!storedOtpData) {
      throw new AppError("Verification Code expired or invalid!", 403);
    }

    const { otp: storedOtp, expiresAt } = storedOtpData;

    if (Date.now() > expiresAt) {
      await deleteOtp(email);
      throw new AppError("Verification Code expired!", 403);
    }

    if (parseInt(otp) !== storedOtp) {
      throw new AppError("Invalid Verification Code!", 403);
    }

    // Update user's verification status
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
  const { email } = req.body;

  try {
    if (!email) {
      throw new AppError("Email is required", 400);
    }

    // Check if an OTP exists for this email
    const existingOtpData = await getOtp(email);
    if (!existingOtpData) {
      throw new AppError(
        "No OTP request found for this email. Please register first.",
        404
      );
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

    await storeOtp(email, newOtp);

    await sendOTPEmail(email, newOtp);

    res
      .status(200)
      .json({ message: "OTP resent successfully. Please check your email." });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError("Email and password are required.", 400);
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    if (!user.isVerified) {
      throw new AppError(
        "Account not verified. Please verify your email.",
        403
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new AppError("Invalid login credentials", 403);
    }

    // Generate tokens and store refresh token in whitelist
    const jti = randomUUID();
    const { accessToken, refreshToken } = generateTokens(user, jti);
    await addRefreshTokenToWhiteList({ jti, refreshToken, userId: user.id });

    setAuthCookies(res, accessToken, refreshToken);

    res.status(200).json({ message: "Login successful", role: user.role });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    clearAuthCookies(res);
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    next(error);
  }
};
