import AppError from "../utils/AppError.js";

const requireRole = (requiredRole) => (req, res, next) => {
  if (!req.user) {
    return next(new AppError("Authentication required", 401));
  }

  if (req.user.role !== requiredRole) {
    return next(new AppError("Access denied", 403));
  }

  next();
};

export default requireRole;
