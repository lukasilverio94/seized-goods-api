import express from "express";
import seizedGoodsRoutes from "./routes/seizedGoodsRoutes.js";
import socialOrganizationRoutes from "./routes/socialOrganizationRoutes.js";
import userAuthRoutes from "./routes/userAuthRoutes.js";
// import allocationRoutes from "./routes/allocationRoutes.js";
import { configDotenv } from "dotenv";
import { errorHandler } from "./middlewares/errorHandler.js";
import { logger } from "./middlewares/logEvents.js";
import cors from "cors";
import cookieParser from "cookie-parser";

configDotenv();

const app = express();

// CORS option config
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//Logger
app.use(logger);

app.use("/api/v1/seized-goods", seizedGoodsRoutes);
app.use("/api/v1/social-organizations", socialOrganizationRoutes);
app.use("/api/v1/users", userAuthRoutes);
// app.use("/api/allocations", allocationRoutes);

// middlewares
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
