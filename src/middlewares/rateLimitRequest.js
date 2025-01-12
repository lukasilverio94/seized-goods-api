import { rateLimit } from "express-rate-limit";

// Define rate limiting rules
const contactFormLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // Limit each IP to 10 requests per windowMs
  standartHeaders: "draft-8",
  message: {
    message:
      "Too many requests from this IP, please try again after 15 minutes.",
  },
});

export default contactFormLimiter;

