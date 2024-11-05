export const errorHandler = (err, req, res, next) => {
  console.log(err.stack);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message || "An unexpected error occurred",
    // include the stack trace only in development
    stack: process.env.NODE === "development" ? err.stack : undefined,
  });
};
