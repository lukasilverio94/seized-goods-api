import express from "express";
import { addClient } from "./serverSentEvents.js";

const router = express.Router();

router.get("/", (req, res) => {
  const categories = req.query.categories
    ? req.query.categories.split(",").map(Number)
    : [];
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.write("retry: 10000\n\n");

  addClient(res, categories);
});

export default router;
