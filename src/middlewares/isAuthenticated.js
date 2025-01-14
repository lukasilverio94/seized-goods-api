import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const isAuthenticated = (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    // Fallback: Try to extract token from the cookies
    else if (req.cookies && req.cookies.refreshToken) {
      token = req.cookies.refreshToken;
    }

    // If no token is found, throw an error
    if (!token) {
      throw new AppError("Authentication token not found", 403);
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user info to the request for downstream use
    req.user = decoded;

    next();
  } catch (error) {
    next(new AppError("Unauthorized: Invalid or missing token", 403));
  }
};

export default isAuthenticated;
