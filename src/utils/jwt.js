import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const secret = process.env.JWT_SECRET;

export const generateAccessToken = (user, jti) => {
  if (!secret) {
    throw new Error("JWT secret is not defined");
  }

  const payload = {
    userId: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    organizationId: user.organizationId,
  };

  return jwt.sign(payload, secret, {
    expiresIn: "1h",
  });
};

export const generateRefreshToken = (user, jti) => {
  if (!secret) {
    throw new Error("JWT secret is not defined");
  }
  return jwt.sign({ id: user.id }, secret, {
    expiresIn: "7d",
  });
};

export const generateTokens = (user, jti) => {
  const accessToken = generateAccessToken(user, jti);
  const refreshToken = generateRefreshToken(user, jti);

  return { accessToken, refreshToken };
};
