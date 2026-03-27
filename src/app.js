import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import router from "./routes/index.js";

const app = express();

// --- Security & Parsing Middleware ---
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// --- HTTP Request Logger (dev only) ---
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// --- API Routes ---
app.use("/api/v1", router);


app.get("/", (req, res) => {
  res.send("University Project Backend is running");

});

// --- Health Check ---

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is healthy" });
});
// --- 404 Handler ---
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (process.env.NODE_ENV !== "production") {
    console.error(`[ERROR] ${statusCode} - ${message}`);
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

export default app;
