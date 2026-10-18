import React from "react";
import { XCircle, RefreshCw, AlertCircle, ArrowLeft } from "lucide-react";

export default function FailureModal({ reason, onRetry }) {
  return (
    <div className="glass-panel" style={{
      maxWidth: "500px",
      width: "100%",
      margin: "0 auto",
      padding: "40px 32px",
      textAlign: "center"
    }}>
      {/* Alert Icon */}
      <div style={{
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        background: "rgba(244, 63, 94, 0.15)",
        border: "2px solid #f43f5e",
        display: "grid",
        placeItems: "center",
        margin: "0 auto 20px",
        color: "#fb7185",
        boxShadow: "0 0 30px rgba(244, 63, 94, 0.3)"
      }}>
        <XCircle size={46} strokeWidth={2.5} />
      </div>

      <div className="badge badge-red" style={{ marginBottom: "12px" }}>
        <span>Transaction Incomplete</span>
      </div>

      <h2 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "8px", letterSpacing: "-0.02em" }}>
        Payment Failed
      </h2>
      <p style={{ color: "var(--text-muted)", fontSize: "15px", marginBottom: "24px" }}>
        Razorpay reported that the payment was not captured or could not be verified.
      </p>

      {/* Error Message Box */}
      <div style={{
        background: "rgba(244, 63, 94, 0.08)",
        border: "1px solid rgba(244, 63, 94, 0.25)",
        borderRadius: "var(--radius-md)",
        padding: "16px 20px",
        textAlign: "left",
        marginBottom: "28px"
      }}>
        <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
          <AlertCircle size={20} color="#fb7185" style={{ flexShrink: 0, marginTop: "2px" }} />
          <div>
            <span style={{ fontSize: "12px", color: "#fb7185", fontWeight: 700, textTransform: "uppercase" }}>
              Failure Reason
            </span>
            <p style={{ fontSize: "14px", color: "#fecdd3", marginTop: "4px", lineHeight: 1.4 }}>
              {reason || "The transaction was canceled or interrupted before completion."}
            </p>
          </div>
        </div>
      </div>

      {/* Helpful Hint */}
      <p style={{ fontSize: "12px", color: "var(--text-dim)", marginBottom: "24px" }}>
        In Test Mode, you can use the test card details provided in the "Test Cards" tab to simulate successful transactions.
      </p>

      {/* Actions */}
      <button
        onClick={onRetry}
        className="btn-primary"
        style={{
          background: "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)",
          boxShadow: "0 4px 18px rgba(244, 63, 94, 0.35)"
        }}
      >
        <RefreshCw size={16} />
        <span>Try Again</span>
      </button>
    </div>
  );
}
