import e from "express";
import configureDotenv from "./src/config/dotenv.js";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { createWriteStream } from "fs";
import morgan from "morgan"; // Import morgan
import chalk from "chalk";
import handleSocket from "./src/socket/socketHandler.js";

configureDotenv();

// file stream where we write logs - works only on PROD :)

if (process.env.ENVIRONMENT !== "DEV") {
  const accessLogStream = createWriteStream("access.log", { flags: "a" });
}

// Initialize Express app
const app = e();

// Use middleware
app.use(cors());
app.use(e.json());
app.use(e.urlencoded({ extended: true }));

// Custom format with color

morgan.token("statusColored", (req, res) => {
  const status = res.statusCode;
  if (status >= 500) return chalk.red(status);
  if (status >= 400) return chalk.red(status);
  if (status >= 300) return chalk.cyan(status);
  if (status >= 200) return chalk.green(status);
  return status;
});

// Colorful format for logging
const colorFormat = (tokens, req, res) => {
  return [
    chalk.gray(tokens.date(req, res, "iso")),
    chalk.magenta(tokens.method(req, res)),
    chalk.blue(tokens.url(req, res)),
    tokens.statusColored(req, res), // Status code with color
    chalk.white(`${tokens["response-time"](req, res)} ms`),
  ].join(" ");
};

if (process.env.ENVIRONMENT === "DEV") {
  // Console log with custom format (colored)
  app.use(morgan(colorFormat));
} else {
  app.use(morgan("combined", { immediate: true, stream: accessLogStream }));
}

// Create server and socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
  },
});

// socketIO handling
handleSocket(io);

// Define routes
app.get("/", (req, res) => {
  res.send("Helloooooooooooo");
});

// Start the server
server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
