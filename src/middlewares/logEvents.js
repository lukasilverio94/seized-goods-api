import { format } from "date-fns";
import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

const logsDir = path.join(process.cwd(), "logs");

const logEvents = async (message, logName) => {
  if (typeof logName !== "string") {
    console.error("logName should be a string, but got:", logName);
    return;
  }

  const dateTime = format(new Date(), "yyyyMMdd\tHH:mm:ss");
  const logItem = `${dateTime}\t${randomUUID()}\t${message}\n`;

  try {
    await fs.mkdir(logsDir, { recursive: true });
    await fs.appendFile(path.join(logsDir, logName), logItem);
  } catch (err) {
    console.error("Failed to write to log:", err);
  }
};

// Logger middleware
const logger = (req, res, next) => {
  try {
    logEvents(
      `${req.method}\t${req.headers.origin || "unknown"}\t${req.url}`,
      "reqLog.txt"
    );
    console.log(`${req.method} ${req.path}`);
  } catch (err) {
    console.error("Error in logger middleware:", err);
  }
  next();
};

export { logger, logEvents };
