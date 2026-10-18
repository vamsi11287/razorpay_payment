const crypto = require("crypto");
const { getRazorpayInstance } = require("../config/razorpay");
const Order = require("../models/Order");
const { getIsConnected } = require("../config/db");

// Fallback in-memory store in case MongoDB is not yet running/configured
const memoryOrders = new Map();

/**
 * POST /api/create-order
 * Creates a new order via Razorpay API and saves it to MongoDB
 */
const createOrder = async (req, res) => {
  const razorpay = getRazorpayInstance();
  if (!razorpay) {
    return res.status(500).json({
      success: false,
      error: "Razorpay credentials missing. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend/.env"
    });
  }

  try {
    const { amount = 100, currency = "INR", customer = {} } = req.body || {};
    const numericAmount = Math.max(100, Math.round(Number(amount) || 100)); // Default min ₹1 (100 paise)
    const receipt = `receipt_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

    const orderOptions = {
      amount: numericAmount,
      currency: currency.toUpperCase(),
      receipt: receipt,
      notes: {
        created_via: "MERN Razorpay Integration",
        customer_name: customer.name || "Guest"
      }
    };

    const order = await razorpay.orders.create(orderOptions);

    // Save order record to DB or memory
    const orderData = {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: "created",
      customer: {
        name: customer.name || "Guest User",
        email: customer.email || "",
        contact: customer.contact || ""
      }
    };

    if (getIsConnected()) {
      try {
        await Order.create(orderData);
      } catch (dbErr) {
        console.warn("Could not save order to MongoDB:", dbErr.message);
      }
    } else {
      memoryOrders.set(order.id, { ...orderData, createdAt: new Date() });
    }

    return res.status(201).json({
      success: true,
      keyId: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt
    });
  } catch (error) {
    console.error("Order creation failed:", error.message);
    return res.status(502).json({
      success: false,
      error: error.message || "Unable to create payment order. Check your Razorpay setup."
    });
  }
};

/**
 * POST /api/verify-payment
 * Verifies Razorpay HMAC signature and confirms captured status
 */
const verifyPayment = async (req, res) => {
  const razorpay = getRazorpayInstance();
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!razorpay || !keySecret) {
    return res.status(500).json({
      verified: false,
      error: "Razorpay credentials not configured on the server."
    });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        verified: false,
        error: "Missing required payment details (order_id, payment_id, or signature)."
      });
    }

    // Step 1: Verify HMAC-SHA256 signature
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    let receivedBuffer;
    let expectedBuffer;
    try {
      receivedBuffer = Buffer.from(razorpay_signature, "hex");
      expectedBuffer = Buffer.from(expectedSignature, "hex");
    } catch {
      return res.status(400).json({ verified: false, error: "Malformed payment signature." });
    }

    if (
      receivedBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(receivedBuffer, expectedBuffer)
    ) {
      // Mark as failed in DB
      if (getIsConnected()) {
        await Order.findOneAndUpdate(
          { orderId: razorpay_order_id },
          { status: "failed", failureReason: "Signature verification failed" }
        );
      }
      return res.status(400).json({
        verified: false,
        error: "Payment signature verification failed. Possible tampering."
      });
    }

    // Step 2: Fetch the payment status from Razorpay API
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    if (
      payment.order_id !== razorpay_order_id ||
      payment.status !== "captured"
    ) {
      return res.status(409).json({
        verified: false,
        error: `Payment is in '${payment.status}' status (expected 'captured'). Do not treat as paid.`
      });
    }

    // Step 3: Update Order in DB or in-memory cache
    let updatedOrder = null;
    if (getIsConnected()) {
      try {
        updatedOrder = await Order.findOneAndUpdate(
          { orderId: razorpay_order_id },
          {
            paymentId: payment.id,
            signature: razorpay_signature,
            status: "paid"
          },
          { new: true }
        );
      } catch (dbErr) {
        console.warn("Could not update order in MongoDB:", dbErr.message);
      }
    } else {
      const existing = memoryOrders.get(razorpay_order_id) || {};
      updatedOrder = {
        ...existing,
        paymentId: payment.id,
        signature: razorpay_signature,
        status: "paid",
        updatedAt: new Date()
      };
      memoryOrders.set(razorpay_order_id, updatedOrder);
    }

    return res.status(200).json({
      verified: true,
      paymentId: payment.id,
      orderId: payment.order_id,
      amount: payment.amount,
      currency: payment.currency,
      method: payment.method,
      email: payment.email,
      contact: payment.contact,
      message: "Payment verified and recorded successfully."
    });
  } catch (error) {
    console.error("Payment verification failed:", error.message);
    return res.status(502).json({
      verified: false,
      error: "Could not verify payment right now. Check Razorpay status."
    });
  }
};

/**
 * GET /api/orders
 * Returns list of recent orders for dashboard/history
 */
const getOrders = async (req, res) => {
  try {
    if (getIsConnected()) {
      const orders = await Order.find().sort({ createdAt: -1 }).limit(50);
      return res.json({ success: true, count: orders.length, orders });
    } else {
      const orders = Array.from(memoryOrders.values()).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      return res.json({ success: true, count: orders.length, orders, fallbackNotice: "In-memory mode (MongoDB not connected)" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/orders/:orderId
 * Fetches single order status
 */
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (getIsConnected()) {
      const order = await Order.findOne({ orderId });
      if (!order) return res.status(404).json({ success: false, error: "Order not found" });
      return res.json({ success: true, order });
    } else {
      const order = memoryOrders.get(orderId);
      if (!order) return res.status(404).json({ success: false, error: "Order not found" });
      return res.json({ success: true, order });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getOrders,
  getOrderById
};
