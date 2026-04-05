import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();

import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const port = process.env.PORT || 8989;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS: allow configured frontend origin (defaults to CRA dev)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3002",
    credentials: true,
  })
);

/* API routes */
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/seller", sellerRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

if (process.env.NODE_ENV === "production") {
  // Serve React build in production
  const buildPath = path.join(__dirname, "../frontend/build");
  app.use(express.static(buildPath));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(buildPath, "index.html"))
  );
} else {
  // Simple health endpoint in development
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port:${port} 🔥`);
});

