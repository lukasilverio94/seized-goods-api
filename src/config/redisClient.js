import { createClient } from "redis";

// Single instance of Redis clients
const redisPublisher = createClient();
const redisSubscriber = createClient();

(async () => {
  try {
    await redisPublisher.connect();
    console.log("Connected to Redis Publisher");
  } catch (error) {
    console.error("Redis Publisher connection error:", error);
  }

  try {
    await redisSubscriber.connect();
    console.log("Connected to Redis Subscriber");
  } catch (error) {
    console.error("Redis Subscriber connection error:", error);
  }
})();

export { redisPublisher, redisSubscriber };
