// SSE Logic to send notifications to client (frontend)
let sseClients = [];

export const addClient = (res) => {
  sseClients.push(res);
  console.log("New client added, total clients:", sseClients.length);

  // remove client on connection close
  res.on("close", () => {
    sseClients = sseClients.filter((client) => client !== res);
    console.log("Client disconnected, total clients:", sseClients.length);
  });
};

export const broadcastToClients = (message) => {
  const formattedMessage = `data: ${JSON.stringify(message)}\n\n`;
  sseClients.forEach((client) => client.write(formattedMessage));
};
