const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    paymentId: {
      type: String,
      default: null,
      index: true
    },
    signature: {
      type: String,
      default: null
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: "INR"
    },
    receipt: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created"
    },
    customer: {
      name: { type: String, default: "Guest User" },
      email: { type: String, default: "" },
      contact: { type: String, default: "" }
    },
    notes: {
      type: Map,
      of: String,
      default: {}
    },
    failureReason: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Order", OrderSchema);
