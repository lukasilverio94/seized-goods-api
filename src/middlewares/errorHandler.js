import AppError from "../utils/AppError.js";

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Check if the error is an instance of AppError
  if (err instanceof AppError) {
    return res.status(err.status || 400).json({ message: err.message });
  }

  // Default to 500 for any other unhandled error
  console.error("Unhandled Error:", err);
  res.status(500).json({ message: "An unexpected error occurred" });
};

export { errorHandler };
