import * as adminService from "../services/adminService.js";

export const promoteUserToAdmin = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const updatedUser = await adminService.promoteUserToAdmin(userId);

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
    const updatedOrganization = await adminService.approveSocialOrganization(
      organizationId
    );
    res.status(200).json({
      message: `${updatedOrganization.name} has been approved. Login to request goods!`,
      organization: updatedOrganization,
    });
  } catch (error) {
    next(error);
  }
};
