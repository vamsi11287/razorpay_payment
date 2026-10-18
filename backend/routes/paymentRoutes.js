const express = require("express");
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getOrders,
  getOrderById
} = require("../controllers/paymentController");

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Razorpay Payment Backend",
    timestamp: new Date().toISOString()
  });
});

// Razorpay checkout endpoints
router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);

// Transaction history endpoints
router.get("/orders", getOrders);
router.get("/orders/:orderId", getOrderById);

module.exports = router;
