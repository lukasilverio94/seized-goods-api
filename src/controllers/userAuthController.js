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

// IMPORTANT!!!!
// Temporary in-memory store for OTPs (use Redis or similar in production)
const otpStore = new Map();

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
    // Generate and send OTP
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    otpStore.set(email, { otp, expiresAt: Date.now() + 10 * 60 * 1000 }); // Store OTP temporarily

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
export const verifyOptUser = async (req, res, next) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      throw new AppError("Email and Verification Code are required", 400);
    }
    const storedOptData = otpStore.get(email);
    if (!storedOptData) {
      throw new AppError("Verification Code expired or invalid!", 403);
    }

    const { otp: storedOtp, expiresAt } = storedOptData;

    if (Date.now() > expiresAt) {
      otpStore.delete(email);
      throw new AppError("Verification Code expired!", 403);
    }

    if (parseInt(otp) !== storedOtp) {
      throw new AppError("Invalid Verification Code!", 403);
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
