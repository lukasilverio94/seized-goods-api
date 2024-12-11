import express from "express";
import { registerUser } from "../controllers/userController.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/users/register:
 *   post:
 *     summary: Create new User
 *     tags: [User Registration]
 *     description: Register User with a role default set to "USER"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   firstName:
 *                     type: string
 *                     description: User's First name.
 *                   lastName:
 *                     type: string
 *                     description: User's Last name.
 *                   email:
 *                     type: string
 *                     description: User's Email.
 *                   organizationId:
 *                     type: integer
 *                     description: Associate to Social Organization ID.
 *                   password:
 *                     type: string
 *                     description: User's Password (min 8 characters).
 */
router.post("/register", registerUser);

export default router;
