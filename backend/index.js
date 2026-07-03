const dotenv = require("dotenv");
dotenv.config();

// Debug: verify env is loaded (without printing secrets)
if (process.env.NODE_ENV !== "production") {
  console.log("Env loaded:", {
    MONGO_URI: !!process.env.MONGO_URI,
    SMTP_HOST: !!process.env.SMTP_HOST,
    SMTP_PORT: !!process.env.SMTP_PORT,
    SMTP_USER: !!process.env.SMTP_USER,
    EMAIL_USER: !!process.env.EMAIL_USER,
  });
}

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const messageRoutes = require("./routes/messageRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const kisanBotRoutes = require("./routes/kisanBotRoutes");
const translateRoutes = require("./routes/translateRoutes");
const connectDB = require("./db/connection");

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.send("KisanBazar API is running");
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/kisan-bot", kisanBotRoutes);
app.use("/api/translate", translateRoutes);
app.use("/api/debug", require("./routes/errorRoutes"));

// Global error handling
const { createGlobalErrorHandler } = require("./utils/errorLogger");
const { errorHandlerMiddleware } = createGlobalErrorHandler();
app.use(errorHandlerMiddleware());

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
