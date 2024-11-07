import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const secret = process.env.JWT_SECRET;

export const generateAccessToken = (user, jti) => {
  if (!secret) {
    throw new Error("JWT secret is not defined");
  }
  return jwt.sign(
    { id: user._id, username: user.username, email: user.email },
    secret,
    {
      expiresIn: "15m",
    }
  );
};

export const generateRefreshToken = (user, jti) => {
  if (!secret) {
    throw new Error("JWT secret is not defined");
  }
  return jwt.sign({ id: user._id }, secret, {
    expiresIn: "7d",
  });
};

export const generateTokens = (user, jti) => {
  const accessToken = generateAccessToken(user, jti);
  const refreshToken = generateRefreshToken(user, jti);

  return { accessToken, refreshToken };
};
