import React, { useState } from "react";
import { Copy, Check, CreditCard, Smartphone, Building, ShieldAlert } from "lucide-react";

export default function TestCardsModal({ onBackToCheckout }) {
  const [copiedKey, setCopiedKey] = useState(null);

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const testData = [
    {
      category: "Domestic Credit/Debit Card (Success)",
      icon: <CreditCard size={18} color="#60a5fa" />,
      items: [
        { label: "Card Number", value: "4111 1111 1111 1111", key: "card-succ" },
        { label: "Expiry", value: "12/28", key: "exp" },
        { label: "CVV", value: "123", key: "cvv" },
        { label: "OTP", value: "123456", key: "otp" }
      ]
    },
    {
      category: "UPI Test VPA (Success)",
      icon: <Smartphone size={18} color="#34d399" />,
      items: [
        { label: "Virtual Payment Address (VPA)", value: "success@razorpay", key: "upi-succ" }
      ]
    },
    {
      category: "Failure Simulation Card (Declined)",
      icon: <ShieldAlert size={18} color="#fb7185" />,
      items: [
        { label: "Card Number (Declined)", value: "4000 0000 0000 1002", key: "card-fail" },
        { label: "Expiry / CVV", value: "11/27 / 123", key: "exp-fail" }
      ]
    }
  ];

  return (
    <div className="glass-panel" style={{
      maxWidth: "650px",
      width: "100%",
      margin: "0 auto",
      padding: "36px 32px"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Razorpay Test Credentials
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "4px" }}>
            Use these official Razorpay test credentials to simulate transactions safely.
          </p>
        </div>
        <button onClick={onBackToCheckout} className="btn-secondary">
          Back to Checkout
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        {testData.map((section, idx) => (
          <div
            key={idx}
            style={{
              background: "rgba(0, 0, 0, 0.25)",
              border: "1px solid var(--bg-card-border)",
              borderRadius: "var(--radius-md)",
              padding: "18px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              {section.icon}
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>
                {section.category}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {section.items.map((item) => (
                <div
                  key={item.key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "rgba(255, 255, 255, 0.04)",
                    padding: "8px 12px",
                    borderRadius: "6px"
                  }}
                >
                  <div>
                    <span style={{ fontSize: "11px", color: "var(--text-dim)", display: "block" }}>
                      {item.label}
                    </span>
                    <code style={{ fontSize: "13px", color: "#93c5fd" }}>
                      {item.value}
                    </code>
                  </div>
                  <button
                    onClick={() => copyText(item.value, item.key)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      background: "rgba(255, 255, 255, 0.06)",
                      border: "1px solid var(--bg-card-border)",
                      color: copiedKey === item.key ? "#34d399" : "var(--text-muted)",
                      padding: "5px 9px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      cursor: "pointer"
                    }}
                  >
                    {copiedKey === item.key ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedKey === item.key ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
