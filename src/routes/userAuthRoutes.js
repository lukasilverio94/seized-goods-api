import express from "express";
import {
  handleUserLogin,
  handleUserLogout,
} from "../controllers/authController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login User
 *     tags: [User Authentication]
 *     description: Login User and generate tokens
 *     requestBody:
 *         required: true
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *                     description: User's Email. *
 *                   password:
 *                     type: string
 *                     description: User's Password (min 8 characters).
 */
router.post("/login", handleUserLogin);

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Retrieves Current Logged In User
 *     tags: [User Authentication]
 *     description: Retrieves the current user that is logged in. It expects accessToken after Login.
 *     responses:
 *       200:
 *         description: User logged in
 *         content:
 *           application/json
 *
 */
router.get("/me", isAuthenticated, (req, res) => {
  res.status(200).json({
    id: req.user._id,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
  });
});
router.post("/logout", handleUserLogout);

export default router;
