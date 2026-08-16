import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import passport from "passport";
import path from "path";
import { fileURLToPath } from "url";

import env from "./config/env.js";
import connectDB from "./config/db.js";
import "./config/passport.js"; // Initialize Google strategy

import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import artisanRoutes from "./routes/artisan.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import artisanProductRoutes from "./routes/artisan-product.routes.js";

import errorMiddleware from "./middlewares/error.middleware.js";
import { generalLimiter } from "./middlewares/rateLimiter.middleware.js";
import ApiResponse from "./utils/ApiResponse.js";
import { autoSeed } from "./utils/autoSeed.js";

// ── __dirname for ESM ─────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Initialize Express ────────────────────────────────────────────
const app = express();

// ── Global Middleware ─────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: env.frontendOrigin,
    credentials: true, // allow cookies
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// HTTP request logging in development
if (env.nodeEnv === "development") {
  app.use(morgan("dev"));
}

// ── Serve uploaded files as static ────────────────────────────────
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

// General rate limiter for all API routes
app.use("/api", generalLimiter);

// ── Routes ────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/artisans", artisanRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/artisan/products", artisanProductRoutes);

// ── Health Check ──────────────────────────────────────────────────
app.get("/api/health", (_req: Request, res: Response) => {
  res
    .status(200)
    .json(new ApiResponse(200, { status: "ok", uptime: process.uptime() }, "Server is healthy"));
});

// ── 404 Handler ───────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    data: null,
    message: "Route not found",
  });
});

// ── Centralized Error Handler ─────────────────────────────────────
app.use(errorMiddleware);


// ── Start Server ──────────────────────────────────────────────────
const startServer = async (): Promise<void> => {
  await connectDB();

  // Ensure artisan/product collections are populated
  await autoSeed();

  app.listen(env.port, () => {
    console.log(`\n🚀  KalaSetu API running on http://localhost:${env.port}`);
    console.log(`📦  Environment: ${env.nodeEnv}`);
    console.log(`🌐  CORS origin: ${env.frontendOrigin}\n`);
  });
};

startServer();

export default app;

