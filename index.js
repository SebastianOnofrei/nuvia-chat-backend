import express from "express";
import configureDotenv from "./src/config/dotenv.js";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { createWriteStream } from "fs";
import morgan from "morgan";
import chalk from "chalk";

import handleSocket from "./src/socket/socketHandler.js";
import connectDB from "./src/config/database.js";

import { router as userRouter } from "./src/routes/userRoutes.js";
import { router as loginRouter } from "./src/config/auth.js";
import { router as friendshipRouter } from "./src/routes/friendshipRoutes.js";
// ✅ Load environment variables
configureDotenv();

if (process.env.ENVIRONMENT !== "DEV") {
  const accessLogStream = createWriteStream("access.log", { flags: "a" });
}

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🎨 Pretty logs in dev
morgan.token("statusColored", (req, res) => {
  const status = res.statusCode;
  if (status >= 500) return chalk.red(status);
  if (status >= 400) return chalk.red(status);
  if (status >= 300) return chalk.cyan(status);
  if (status >= 200) return chalk.green(status);
  return status;
});

const colorFormat = (tokens, req, res) => {
  return [
    chalk.gray(tokens.date(req, res, "iso")),
    chalk.magenta(tokens.method(req, res)),
    chalk.blue(tokens.url(req, res)),
    tokens.statusColored(req, res),
    chalk.white(`${tokens["response-time"](req, res)} ms`),
  ].join(" ");
};

if (process.env.ENVIRONMENT === "DEV") {
  app.use(morgan(colorFormat));
} else {
  app.use(morgan("combined", { immediate: true, stream: accessLogStream }));
}

// 👇 HTTP server + Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001", // frontend URL
  },
});

// 🧠 WebSocket logic
handleSocket(io);

// 👇 API Routes
app.use("/login", loginRouter);
app.use("/user", userRouter);
app.use("/friendship", friendshipRouter);

// 🛡️ Error middleware
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json("unauthorized");
  } else {
    next();
  }
});

app.get("/", (req, res) => {
  res.send("✅ Server is alive!");
});

// 🚀 Start
server.listen(process.env.PORT || 3000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
