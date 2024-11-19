import { createClient } from "redis";

// create redis publisher
export const redisPublisher = createClient();
export const redisSubscriber = createClient();

// connect to redis
(async () => {
  try {
    await redisPublisher.connect();
    await redisSubscriber.connect();
    console.log("Connected to Redis!");
  } catch (error) {
    console.log("Redis connection error:", error);
  }
})();
