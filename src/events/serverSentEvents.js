export let sseClients = [];

// Add a client with more detailed subscription options
export const addClient = (res, subscription) => {
  const defaultSubscription = { categories: [], organizationId: null }; // Default structure
  const validSubscription = { ...defaultSubscription, ...subscription }; // Merge user input with default

  sseClients.push({ res, subscription: validSubscription });
  console.log("New client added, total clients:", sseClients.length);

  // Remove client on connection close
  res.on("close", () => {
    sseClients = sseClients.filter((client) => client.res !== res);
    console.log("Client disconnected, total clients:", sseClients.length);
  });
};

// Broadcast notifications about items
export const broadcastItemsToOrganizations = (message, categoryId) => {
  const formattedMessage = `data: ${JSON.stringify(message)}\n\n`;
  sseClients.forEach(({ res, subscription }) => {
    if (subscription.categories.includes(categoryId)) {
      res.write(formattedMessage);
    }
  });
};

// Broadcast notifications about requests to admins
export const broadcastRequestsToAdmin = (message) => {
  const formattedMessage = `data: ${JSON.stringify(message)}\n\n`;
  sseClients.forEach(({ res, subscription }) => {
    if (subscription.role === "admin") {
      res.write(formattedMessage);
    }
  });
};
