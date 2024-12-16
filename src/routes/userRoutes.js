import express from "express";
import {
  registerUser,
  verifyOtpUser,
  resendOtpCode,
} from "../controllers/userController.js";
import { userValidationRules } from "../validators/user.js";
import { handleValidationErrors } from "../middlewares/handleValidationErrors.js";

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

router.post("/verify-otp", verifyOtpUser);
router.post("/resend-otp", resendOtpCode);

export default router;
