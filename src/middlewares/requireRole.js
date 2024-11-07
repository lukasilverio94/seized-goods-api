const requireRole = (requiredRole) => (req, res, next) => {
  if (req.user.role !== requiredRole) {
    return next(new AppError("Access denied", 403));
  }
  next();
};

export default requireRole;
