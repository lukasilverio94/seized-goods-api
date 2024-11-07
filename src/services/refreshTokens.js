import prisma from "../../prisma/client.js";
import hashToken from "../utils/hashToken.js";

export const addRefreshTokenToWhiteList = async ({
  jti,
  refreshToken,
  userId,
}) => {
  const hashedToken = await hashToken(refreshToken);

  return await prisma.refreshToken.create({
    data: {
      id: jti,
      hashedToken,
      userId,
    },
  });
};

export const findRefreshTokenById = async (id) => {
  return await prisma.refreshToken.findUnique({
    where: { id },
  });
};

export const deleteRefreshToken = async (id) => {
  return await prisma.refreshToken.update({
    where: { id },
    data: { revoked: true },
  });
};

export const revokeTokens = async (userId) => {
  return await prisma.refreshToken.updateMany({
    where: { userId },
    data: { revoked: true },
  });
};
