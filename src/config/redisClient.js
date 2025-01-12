import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL || "http://localhost:6379",
  socket: {
    tls: true,
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.error("Redis: Too many retries, giving up");
        return new Error("Retry limit exceeded");
      }
      console.log(`Redis: Attempting to reconnect (#${retries})`);
      return Math.min(retries * 100, 3000); // Exponential backoff, max 3 seconds
    },
    connectTimeout: 1000, //10 seconds
  },
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
