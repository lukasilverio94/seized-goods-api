import express from "express";
import seizedGoodsRoutes from "./routes/seizedGoodsRoutes.js";
import socialOrganizationRoutes from "./routes/socialOrganizationRoutes.js";
import userAuthRoutes from "./routes/userAuthRoutes.js";
// import allocationRoutes from "./routes/allocationRoutes.js";
import { configDotenv } from "dotenv";
import { errorHandler } from "./middlewares/errorHandler.js";
import { logger } from "./middlewares/logEvents.js";
import { cloudinaryConfig } from "./config/cloudinary.js";
import cors from "cors";

configDotenv();
cloudinaryConfig();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Authorization,Content-Type"],
    credentials: true,
  })
);

//Logger
app.use(logger);

app.use("/api/v1/seized-goods", seizedGoodsRoutes);
app.use("/api/v1/social-organizations", socialOrganizationRoutes);
app.use("/api/v1/users", userAuthRoutes);
// app.use("/api/allocations", allocationRoutes);
app.use("/uploads", express.static("public/uploads"));

// middlewares
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
