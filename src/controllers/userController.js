import * as userService from "../services/userService.js";
import * as resetPasswordService from "../services/resetPasswordService.js";
import AppError from "../utils/AppError.js";
import prisma from "../../prisma/client.js";

export const handleRegisterUser = async (req, res, next) => {
  try {
    const user = await userService.registerUser(req.body);
    res.status(200).json({
      message:
        "User registered successfully. A verification code has been sent to your email.",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const requestResetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const message = await resetPasswordService.requestResetPassword(email);
    res.status(200).json({ message });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    const message = await resetPasswordService.resetPassword(
      token,
      newPassword
    );
    res.status(200).json({ message });
  } catch (error) {
    next(error);
  }
};

export const handleGetAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const handleDeleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    await userService.deleteUser(userId);
    res.status(204).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const handleUpdateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, email, isVerified, role, organizationId } =
      req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        email,
        isVerified,
        role,
        organizationId,
      },
    });

    if (!updatedUser) {
      throw new AppError(
        "Something went wrong to update user: " + updatedUser.firstName,
        400
      );
    }

    res.status(201).json(updatedUser);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        error: `User with ID ${req.params.userId} not found`,
      });
    }
    next(error);
  }
};
