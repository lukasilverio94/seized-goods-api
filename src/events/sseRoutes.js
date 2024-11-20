import express from "express";
import { addClient } from "./serverSentEvents.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Connection", "keep-alive");

  res.write("retry: 10000\n\n");

  addClient(res);
});

export default router;
