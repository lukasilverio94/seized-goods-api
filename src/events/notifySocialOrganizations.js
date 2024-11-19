import prisma from "../../prisma/client.js";

export const notifySocialOrganizations = async (seizedGood) => {
  try {
    const socialOrgs = await prisma.socialOrganization.findMany();

    // Select the desired fields
    const { name, description, value } = seizedGood;

    // Include images if they exist
    const images = seizedGood.images || []; // Assuming `images` is part of the seizedGood object

    const notificationPayload = { name, description, value, images };

    socialOrgs.forEach((socialOrg) => {
      console.log(
        `Notifying ${socialOrg.name} about new seized good: ${JSON.stringify(
          notificationPayload,
          null,
          2
        )}`
      );

      // set email logic here if this is the message we want send by email, sms, whatever
    });
  } catch (error) {
    console.error("Error notifying Social Organizations:", error);
  }
};
