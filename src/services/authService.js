import AppError from "../utils/AppError.js";
import { findUserByEmail } from "../repositories/userRepository.js";
import bcrypt from "bcrypt";
import { randomUUID } from "node:crypto";
import { generateTokens } from "../utils/jwt.js";
import { addRefreshTokenToWhiteList } from "../services/refreshTokens.js";

export const loginUserService = async (userData) => {
  const { email, password } = userData;

  const user = await findUserByEmail(email);

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  if (!user.isVerified) {
    throw new AppError(
      "Your account is still not verified, please verify with the OTP code sent to your email or request new OTP code.",
      400
    );
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

  return { accessToken, refreshToken };
};
