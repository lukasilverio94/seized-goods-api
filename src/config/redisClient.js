import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL || "http://localhost:6379",
});

redisClient.on("error", (err) => console.error("Redis Client Error:", err));

// connect to redis
const connectRedis = async () => {
  if (!redisClient.isReady) {
    await redisClient.connect();
    console.log("Connected to Redis successfully");
  }
};

connectRedis().catch((err) =>
  console.error("Error connecting to Redis: ", err)
);

export default redisClient;