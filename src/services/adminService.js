import * as userRepository from "../repositories/userRepository.js";
import * as organizationRepository from "../repositories/organizationRepository.js";
import AppError from "../utils/AppError.js";

export const promoteUserToAdmin = async (userId) => {
  try {
    const user = await userRepository.findUserById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.role === "ADMIN") {
      throw new AppError("User is already an admin.", 400);
    }

    const updatedUser = await userRepository.updateUser(userId, {
      role: "ADMIN",
    });

    return updatedUser;
  } catch (error) {
    console.log("Error promoting user to admin:", error);
    throw new AppError(error);
  }
};

export const approveSocialOrganization = async (organizationId) => {
  const organization = await organizationRepository.findOrganizationById(
    parseInt(organizationId)
  );

  if (!organization) {
    throw new AppError("Organization not found", 404);
  }

  if (organization.status === "APPROVED") {
    throw new AppError("This Organization is already approved.", 400);
  }

  const updatedOrganization = await organizationRepository.updateOrganization(
    parseInt(organizationId),
    {
      status: "APPROVED",
    }
  );

  return updatedOrganization;
};
