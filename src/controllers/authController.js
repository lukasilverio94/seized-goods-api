import { setAuthCookies, clearAuthCookies } from "../utils/setAuthCookies.js";
import { loginUserService } from "../services/authService.js";

export const handleUserLogin = async (req, res, next) => {
  try {
    const { accessToken, refreshToken, user } = await loginUserService(
      req.body
    );

    setAuthCookies(res, accessToken, refreshToken);
    res
      .status(200)
      .json({ message: "Login successful", accessToken, refreshToken, user });
  } catch (error) {
    next(error);
  }
};

export const handleUserLogout = async (req, res, next) => {
  try {
    clearAuthCookies(res);
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    next(error);
  }
};
