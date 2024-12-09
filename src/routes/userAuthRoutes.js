import express from "express";
import { loginUser, logoutUser } from "../controllers/authController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/login", loginUser);
router.get("/me", isAuthenticated, (req, res) => {
  res.status(200).json({
    id: req.user._id,
    username: req.user.username,
    email: req.user.email,
  });
});
router.post("/logout", logoutUser);

export default router;
