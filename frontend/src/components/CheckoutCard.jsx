import React, { useState } from "react";
import { Lock, ShoppingBag, ArrowRight, Loader2, Sparkles, AlertTriangle } from "lucide-react";
import { createOrder, verifyPayment } from "../services/api";

export default function CheckoutCard({ onSuccess, onFailure }) {
  const [amount, setAmount] = useState(1); // Default ₹1
  const [customer, setCustomer] = useState({
    name: "Alex Johnson",
    email: "alex.demo@example.com",
    contact: "9999999999"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  const handlePay = async () => {
    // Check if Razorpay script is loaded in browser
    if (typeof window.Razorpay === "undefined") {
      alert("Razorpay SDK failed to load. Please check your internet connection.");
      return;
    }

    setIsLoading(true);
    setStatusMessage("Creating secure order on server…");

    try {
      // 1. Request backend to create an order
      const amountInPaise = Math.round(Number(amount) * 100);
      const orderData = await createOrder({
        amount: amountInPaise,
        currency: "INR",
        customer
      });

      setStatusMessage("Opening Razorpay Checkout modal…");

      // 2. Initialize Razorpay Checkout
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "My Store (MERN)",
        description: `Payment for ₹${amount} Demo Order`,
        order_id: orderData.orderId,
        prefill: {
          name: customer.name,
          email: customer.email,
          contact: customer.contact
        },
        theme: {
          color: "#2563eb"
        },
        handler: async (response) => {
          setStatusMessage("Verifying signature and payment capture…");
          try {
            const verification = await verifyPayment(response);
            setIsLoading(false);
            setStatusMessage("");
            onSuccess({
              paymentId: verification.paymentId,
              orderId: verification.orderId,
              amount: verification.amount / 100,
              currency: verification.currency,
              timestamp: new Date().toLocaleTimeString()
            });
          } catch (err) {
            setIsLoading(false);
            setStatusMessage("");
            onFailure(err.message || "Payment verification failed on backend.");
          }
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            setStatusMessage("Checkout window closed without completing payment.");
          }
        }
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", (response) => {
        setIsLoading(false);
        setStatusMessage("");
        const reason = response.error ? response.error.description : "Payment transaction failed.";
        onFailure(reason);
      });

      razorpay.open();
    } catch (error) {
      console.error("Checkout initialization failed:", error);
      setIsLoading(false);
      setStatusMessage("");
      onFailure(
        error.message.includes("Failed to fetch")
          ? "Cannot connect to the backend server. Please verify your internet connection or check if the backend service is active."
          : error.message
      );
    }
  };

  return (
    <div className="glass-panel" style={{
      maxWidth: "480px",
      width: "100%",
      margin: "0 auto",
      padding: "36px 32px",
      position: "relative"
    }}>
      {/* Product Icon & Title */}
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <div style={{
          width: "72px",
          height: "72px",
          borderRadius: "20px",
          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.4) 100%)",
          border: "1px solid rgba(59, 130, 246, 0.3)",
          display: "grid",
          placeItems: "center",
          margin: "0 auto 16px",
          fontSize: "32px"
        }}>
          🛍️
        </div>

        <h1 style={{ fontSize: "26px", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "6px" }}>
          Demo Store Checkout
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          Complete test checkout with Razorpay and MERN backend
        </p>
      </div>

      {/* Amount Selector */}
      <div style={{
        background: "rgba(0, 0, 0, 0.25)",
        border: "1px solid var(--bg-card-border)",
        borderRadius: "var(--radius-md)",
        padding: "20px",
        marginBottom: "24px"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-muted)" }}>
            CHECKOUT AMOUNT
          </span>
          <span className="badge badge-green" style={{ fontSize: "11px" }}>
            Test Mode (Paise)
          </span>
        </div>

        {/* Big Amount Display */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "16px" }}>
          <span style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-muted)" }}>₹</span>
          <span style={{ fontSize: "42px", fontWeight: 800, letterSpacing: "-0.03em", color: "#ffffff" }}>
            {Number(amount).toFixed(2)}
          </span>
          <span style={{ fontSize: "13px", color: "var(--text-muted)", marginLeft: "auto" }}>
            ({Math.round(amount * 100)} paise)
          </span>
        </div>

        {/* Quick Amount Pills */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
          {[1, 5, 10].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setAmount(val)}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: amount === val ? "1px solid #3b82f6" : "1px solid var(--bg-card-border)",
                background: amount === val ? "rgba(59, 130, 246, 0.25)" : "rgba(255, 255, 255, 0.04)",
                color: amount === val ? "#93c5fd" : "var(--text-muted)",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "var(--transition)"
              }}
            >
              ₹{val}.00 {val === 1 && " (Original)"}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Info Accordion */}
      <div style={{ marginBottom: "24px" }}>
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          style={{
            background: "transparent",
            border: "none",
            color: "#60a5fa",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: 0
          }}
        >
          <span>{showDetails ? "Hide customer details" : "Customize customer details (Optional)"}</span>
        </button>

        {showDetails && (
          <div style={{
            marginTop: "12px",
            padding: "16px",
            background: "rgba(0, 0, 0, 0.2)",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--bg-card-border)",
            display: "flex",
            flexDirection: "column",
            gap: "10px"
          }}>
            <div>
              <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                Name
              </label>
              <input
                type="text"
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid var(--bg-card-border)",
                  color: "#fff",
                  fontSize: "13px"
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                Email
              </label>
              <input
                type="email"
                value={customer.email}
                onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid var(--bg-card-border)",
                  color: "#fff",
                  fontSize: "13px"
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Pay Button */}
      <button
        id="payButton"
        type="button"
        className="btn-primary"
        onClick={handlePay}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <Lock size={16} />
            <span>Pay ₹{Number(amount).toFixed(2)} Securely</span>
            <ArrowRight size={16} />
          </>
        )}
      </button>

      {/* Dynamic Status Text */}
      {statusMessage && (
        <p style={{
          marginTop: "16px",
          fontSize: "13px",
          color: "var(--text-muted)",
          textAlign: "center",
          background: "rgba(255, 255, 255, 0.04)",
          padding: "10px 14px",
          borderRadius: "8px",
          border: "1px solid var(--bg-card-border)"
        }}>
          {statusMessage}
        </p>
      )}

      {/* Security Footer */}
      <div style={{
        marginTop: "24px",
        paddingTop: "20px",
        borderTop: "1px solid var(--bg-card-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        color: "var(--text-dim)",
        fontSize: "12px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <Lock size={13} />
          <span>256-bit SSL</span>
        </div>
        <span>•</span>
        <span>Razorpay Test Gateway</span>
        <span>•</span>
        <span>MERN Verified</span>
      </div>
    </div>
  );
}
