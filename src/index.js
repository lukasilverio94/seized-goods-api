import express from "express";
import helmet from "helmet";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import adminRoutes from "./routes/adminRoutes.js";
import seizedGoodsRoutes from "./routes/seizedGoodsRoutes.js";
import socialOrganizationRoutes from "./routes/socialOrganizationRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import userAuthRoutes from "./routes/userAuthRoutes.js";
import categoryRoutes from "./routes/categoryItemRoutes.js";
import requestSeizedGoodRoutes from "./routes/requestSeizedGoodRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import contactUsRoutes from "./routes/contactUsRoutes.js";
// import allocationRoutes from "./routes/allocationRoutes.js";
import { configDotenv } from "dotenv";
import { errorHandler } from "./middlewares/errorHandler.js";
import { logger } from "./middlewares/logEvents.js";
import { cloudinaryConfig } from "./config/cloudinary.js";
import cors from "cors";
import cookieParser from "cookie-parser";
// server sent events
import sseRoutes from "./events/sseRoutes.js";
//swagger
import swaggerUi from "swagger-ui-express";
import { specs } from "./utils/swagger.js";

configDotenv();
cloudinaryConfig();

const app = express();

app.use(helmet());

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Home route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "home.html"));
});

// CORS option config
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3001',
    'http://localhost:5173',
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: ["Authorization,Content-Type"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//Logger
app.use(logger);

app.use("/admin", adminRoutes);
app.use("/events", sseRoutes);
app.use("/api/v1/seized-goods", seizedGoodsRoutes);
app.use("/api/v1/organizations", socialOrganizationRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", userAuthRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/requests", requestSeizedGoodRoutes);
app.use("/api/v1/feedbacks", feedbackRoutes);
app.use("/api/v1/contact", contactUsRoutes);
// app.use("/api/allocations", allocationRoutes);
app.use("/uploads", express.static("public/uploads"));

// error handling middleware should be at end
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
