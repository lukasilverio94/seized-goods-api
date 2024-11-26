import { createClient } from "redis";

// Initialize Redis client
const redisClient = createClient();

redisClient.on("error", (err) => console.error("Redis Client Error:", err));

// Connect to Redis
const connectRedis = async () => {
  if (!redisClient.isReady) {
    await redisClient.connect();
    console.log("Connected to Redis successfully!");
  }
};

connectRedis().catch((err) => console.error("Error connecting to Redis:", err));

export default redisClient;
