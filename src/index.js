import express from "express";
import seizedGoodsRoutes from "./routes/seizedGoodsRoutes.js";
import socialOrganizationRoutes from "./routes/socialOrganizationRoutes.js";
// import allocationRoutes from "./routes/allocationRoutes.js";
import { configDotenv } from "dotenv";
import { errorHandler } from "./middlewares/errorHandler.js";
configDotenv();

const app = express();

app.use(express.json());

app.use("/api/v1/seized-goods", seizedGoodsRoutes);
app.use("/api/v1/social-organizations", socialOrganizationRoutes);
// app.use("/api/allocations", allocationRoutes);

// middlewares
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
