import express from "express";
import { loginUser, logoutUser } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", loginUser);
router.get("/me", authMiddleware, (req, res) => {
  res.status(200).json({
    id: req.user._id,
    username: req.user.username,
    email: req.user.email,
  });
});
router.post("/logout", logoutUser);

export default router;
