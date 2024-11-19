import { redisSubscriber } from "../config/redisClient.js";
import { notifySocialOrganizations } from "./notifySocialOrganizations.js";
import { io } from "../index.js";

(async () => {
  try {
    // Await the subscription initialization
    await redisSubscriber.subscribe("newSeizedGoods", async (message) => {
      console.log("Subscribed to channel: newSeizedGoods");
      try {
        const seizedGood = JSON.parse(message);
        // Notify NGOs about the new item
        await notifySocialOrganizations(seizedGood);
        io.emit("new-seized-good", seizedGood);
      } catch (error) {
        console.log("Error handling new seized good:", error);
      }
    });
  } catch (error) {
    console.error("Error subscribing to channel:", error);
  }
})();
