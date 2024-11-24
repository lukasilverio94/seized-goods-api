import express from "express";
import { addClient } from "./serverSentEvents.js";

const router = express.Router();

router.get("/", (request, response) => {
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };

  const categories = request.query.categories
    ? request.query.categories.split(",").map(Number)
    : [];

  response.writeHead(200, headers);

  response.write("retry: 10000\n\n");

  addClient(response, categories);
});

export default router;
