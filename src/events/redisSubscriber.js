import { redisSubscriber } from "../config/redisClient.js";
import { notifySocialOrganizations } from "./notifySocialOrganizations.js";

(async () => {
  try {
    // Await the subscription initialization
    await redisSubscriber.subscribe("newSeizedGoods", async (message) => {
      console.log("Subscribed to channel: newSeizedGoods");
      try {
        const seizedGood = JSON.parse(message);
        console.log("New item added: ", seizedGood);
        // Notify NGOs about the new item
        await notifySocialOrganizations(seizedGood);
      } catch (error) {
        console.log("Error handling new seized good:", error);
      }
    });
    console.log("Successfully subscribed to channel: newSeizedGoods");
  } catch (error) {
    console.error("Error subscribing to channel:", error);
  }
})();
