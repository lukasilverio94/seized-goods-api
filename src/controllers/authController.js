import prisma from "../../prisma/client.js";
import bcrypt from "bcrypt";
import { randomUUID } from "node:crypto";
import AppError from "../utils/AppError.js";
import { generateTokens } from "../utils/jwt.js";
import { addRefreshTokenToWhiteList } from "../services/refreshTokens.js";
import { setAuthCookies, clearAuthCookies } from "../utils/setAuthCookies.js";

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError("Email and password are required.", 400);
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        password: true,
        role: true,
        organizationId: true,
      },
    });
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new AppError("Invalid login credentials", 403);
    }

    // Generate tokens and store refresh token in whitelist
    const jti = randomUUID();
    const { accessToken, refreshToken } = generateTokens(
      {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        organizationId: user.organizationId,
        role: user.role,
      },
      jti
    );
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
