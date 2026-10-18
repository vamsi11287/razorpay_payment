import React, { useState } from "react";
import { CheckCircle2, Copy, Check, ArrowLeft, ExternalLink, ShieldCheck } from "lucide-react";

export default function SuccessModal({ data, onReset, onViewOrders }) {
  const [copied, setCopied] = useState(false);

  const copyPaymentId = () => {
    if (data?.paymentId) {
      navigator.clipboard.writeText(data.paymentId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="glass-panel" style={{
      maxWidth: "500px",
      width: "100%",
      margin: "0 auto",
      padding: "40px 32px",
      textAlign: "center"
    }}>
      {/* Animated Check Icon */}
      <div style={{
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        background: "rgba(16, 185, 129, 0.15)",
        border: "2px solid #10b981",
        display: "grid",
        placeItems: "center",
        margin: "0 auto 20px",
        color: "#34d399",
        boxShadow: "0 0 30px rgba(16, 185, 129, 0.3)"
      }}>
        <CheckCircle2 size={46} strokeWidth={2.5} />
      </div>

      <div className="badge badge-green" style={{ marginBottom: "12px" }}>
        <ShieldCheck size={14} />
        <span>Server-Side Signature Verified</span>
      </div>

      <h2 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "8px", letterSpacing: "-0.02em" }}>
        Payment Successful!
      </h2>
      <p style={{ color: "var(--text-muted)", fontSize: "15px", marginBottom: "28px" }}>
        Your ₹{data?.amount?.toFixed(2) || "1.00"} payment has been captured and recorded in the database.
      </p>

      {/* Details Box */}
      <div style={{
        background: "rgba(0, 0, 0, 0.35)",
        border: "1px solid var(--bg-card-border)",
        borderRadius: "var(--radius-md)",
        padding: "20px",
        textAlign: "left",
        marginBottom: "28px",
        display: "flex",
        flexDirection: "column",
        gap: "12px"
      }}>
        <div>
          <span style={{ fontSize: "11px", color: "var(--text-dim)", textTransform: "uppercase", fontWeight: 700 }}>
            Payment ID
          </span>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "4px",
            background: "rgba(255, 255, 255, 0.05)",
            padding: "8px 12px",
            borderRadius: "6px"
          }}>
            <code style={{ fontSize: "13px", color: "#60a5fa", wordBreak: "break-all" }}>
              {data?.paymentId || "pay_demo123456"}
            </code>
            <button
              onClick={copyPaymentId}
              style={{
                background: "transparent",
                border: "none",
                color: copied ? "#34d399" : "var(--text-muted)",
                cursor: "pointer",
                padding: "4px"
              }}
              title="Copy Payment ID"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        {data?.orderId && (
          <div>
            <span style={{ fontSize: "11px", color: "var(--text-dim)", textTransform: "uppercase", fontWeight: 700 }}>
              Razorpay Order ID
            </span>
            <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>
              <code>{data.orderId}</code>
            </div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px", borderTop: "1px solid var(--bg-card-border)" }}>
          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Status</span>
          <span className="badge badge-green">Captured & Validated</span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "12px", flexDirection: "column" }}>
        <button
          onClick={onViewOrders}
          className="btn-primary"
          style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", boxShadow: "0 4px 18px rgba(16, 185, 129, 0.35)" }}
        >
          View in Order History
        </button>

        <button
          onClick={onReset}
          className="btn-secondary"
        >
          <ArrowLeft size={16} />
          Make Another Test Payment
        </button>
      </div>
    </div>
  );
}
