import express from "express";
import seizedGoodsRoutes from "./routes/seizedGoodsRoutes.js";
import socialOrganizationRoutes from "./routes/socialOrganizationRoutes.js";
import userAuthRoutes from "./routes/userAuthRoutes.js";
import categoryRoutes from "./routes/categoryItemRoutes.js";
// import allocationRoutes from "./routes/allocationRoutes.js";
import { configDotenv } from "dotenv";
import { errorHandler } from "./middlewares/errorHandler.js";
import { logger } from "./middlewares/logEvents.js";
import { cloudinaryConfig } from "./config/cloudinary.js";
import cors from "cors";
import cookieParser from "cookie-parser";

configDotenv();
cloudinaryConfig();

const app = express();

// CORS option config
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//Logger
app.use(logger);

app.use("/api/v1/seized-goods", seizedGoodsRoutes);
app.use("/api/v1/social-organizations", socialOrganizationRoutes);
app.use("/api/v1/users", userAuthRoutes);
app.use("/api/v1/categories", categoryRoutes);
// app.use("/api/allocations", allocationRoutes);
app.use("/uploads", express.static("public/uploads"));

// middlewares
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
