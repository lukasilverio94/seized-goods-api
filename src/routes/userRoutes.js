import express from "express";
import {
  registerUser,
  verifyOtpUser,
  resendOtpCode,
  requestResetPassword,
  resetPassword,
  handleGetAllUsers,
  handleDeleteUser,
  handleUpdateUser,
} from "../controllers/userController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import requireRole from "../middlewares/requireRole.js";
import { userValidationRules } from "../validators/user.js";
import { handleValidationErrors } from "../middlewares/handleValidationErrors.js";
import {
  validateOtpCodeRules,
  resendOtpCodeRules,
} from "../validators/otpCode.js";
import {
  requestResetPassRules,
  resetPasswordRules,
} from "../validators/resetPassword.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/users/register:
 *   post:
 *     summary: Create new User
 *     tags: [User Registration]
 *     description: Register a user with a default role set to "USER".
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The created user object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input or validation error.
 */
router.post(
  "/register",
  userValidationRules,
  handleValidationErrors,
  registerUser
);

/**
 * @swagger
 * /api/v1/users/verify-otp:
 *   post:
 *     summary: Verify OTP Code
 *     tags: [User Registration]
 *     description: Verify the sent OTP code to user's email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OTP'
 *     responses:
 *       200:
 *         description: User verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OTP'
 *       400:
 *         description: Invalid input or validation error.
 */
router.post(
  "/verify-otp",
  validateOtpCodeRules,
  handleValidationErrors,
  verifyOtpUser
);

router.post(
  "/resend-otp",
  resendOtpCodeRules,
  handleValidationErrors,
  resendOtpCode
);

router.post(
  "/reset-password/request",
  requestResetPassRules,
  handleValidationErrors,
  requestResetPassword
);

router.post(
  "/reset-password",
  resetPasswordRules,
  handleValidationErrors,
  resetPassword
);

// Get All Users
// @ private Admin required
router.get("/", isAuthenticated, requireRole("ADMIN"), handleGetAllUsers);

// Update User By Id
// @ private Admin required
router.put("/:userId", isAuthenticated, requireRole("ADMIN"), handleUpdateUser);

// Delete User By Id
// @ private Admin required
router.delete(
  "/:userId",
  isAuthenticated,
  requireRole("ADMIN"),
  handleDeleteUser
);

export default router;
