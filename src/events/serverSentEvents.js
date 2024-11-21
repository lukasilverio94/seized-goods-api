// SSE Logic to send notifications to client (frontend)
let sseClients = [];

export const addClient = (res, categories) => {
  const validCategories = Array.isArray(categories) ? categories : [];
  sseClients.push({ res, categories: validCategories });
  console.log("New client added, total clients:", sseClients.length);

  // remove client on connection close
  res.on("close", () => {
    sseClients = sseClients.filter((client) => client.res !== res);
    console.log("Client disconnected, total clients:", sseClients.length);
  });
};

export const broadcastToClients = (message, categoryId) => {
  const formattedMessage = `data: ${JSON.stringify(message)}\n\n`;
  sseClients.forEach(({ res, categories }) => {
    if (Array.isArray(categories) && categories.includes(categoryId)) {
      res.write(formattedMessage);
    }
  });
};
