import prisma from "../../prisma/client.js";
import AppError from "../utils/AppError.js";

export const promoteUserToAdmin = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.role === "ADMIN") {
      throw new AppError("User is already an admin.", 400);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        role: "ADMIN",
      },
    });

    res.status(200).json({
      message: "User promoted to admin successfully",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const approveSocialOrganization = async (req, res, next) => {
  const { organizationId } = req.params;

  try {
    if (!req.user || req.user.role !== "ADMIN") {
      throw new AppError(
        "Unauthorized: Only admins can create other admins",
        403
      );
    }
    const updatedOrganization = await prisma.socialOrganization.findUnique({
      where: { id: parseInt(organizationId) },
      data: {
        status: "APPROVED",
      },
    });

    res.status(200).json({
      message: `Social Organization: ${updatedOrganization} has been approved. Login to request goods!`,
      organization: updatedOrganization,
    });
  } catch (error) {
    next(error);
  }
};
