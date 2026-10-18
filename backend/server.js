require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { connectDB } = require("./config/db");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

// Security and parser configuration
app.disable("x-powered-by");
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true, limit: "50kb" }));

// Configure CORS for separate hosting
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000"
];

if (process.env.CLIENT_URL) {
  process.env.CLIENT_URL.split(",").forEach((url) => {
    const trimmed = url.trim();
    if (trimmed && !allowedOrigins.includes(trimmed)) {
      allowedOrigins.push(trimmed);
    }
  });
}

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || process.env.CLIENT_URL === "*") {
        return callback(null, true);
      }
      // If deployed in production, allow wildcard or log origin
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Connect to MongoDB
connectDB();

// API Routes
app.use("/api", paymentRoutes);

// Root informational endpoint
app.get("/", (req, res) => {
  res.json({
    name: "Razorpay MERN Payment API",
    version: "1.0.0",
    status: "online",
    endpoints: {
      health: "/api/health",
      createOrder: "POST /api/create-order",
      verifyPayment: "POST /api/verify-payment",
      orders: "GET /api/orders"
    }
  });
});

// 404 Handler for undefined API routes
app.use((req, res) => {
  res.status(404).json({ error: "API route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log("==========================================");
  console.log(` Razorpay Backend Server running on port ${PORT}`);
  console.log(` API Base URL: http://localhost:${PORT}/api`);
  console.log(` Client Origin: ${process.env.CLIENT_URL || "http://localhost:5173"}`);
  
  const keyId = process.env.RAZORPAY_KEY_ID;
  if (!keyId || keyId === '""') {
    console.warn(" NOTE: Razorpay API keys not yet provided in backend/.env");
    console.warn("       Add your RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET to test live checkout.");
  } else {
    console.log(` Razorpay Key ID loaded: ${keyId.substring(0, 8)}...`);
  }
  console.log("==========================================");
});
