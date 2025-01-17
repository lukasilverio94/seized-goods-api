import express from "express";
import { addClient } from "./serverSentEvents.js";

const router = express.Router();

router.get("/", (request, response) => {
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };
  const isAdmin = request.query.role === "admin";
  const categories = request.query.categories
    ? request.query.categories.split(",").map(Number)
    : [];

  const organizationId = request.query.organizationId
    ? parseInt(request.query.organizationId, 10)
    : null;

  response.writeHead(200, headers);

  response.write("retry: 10000\n\n");

  addClient(response, {
    categories,
    organizationId,
    role: isAdmin ? "admin" : "user",
  });
});

export default router;
