import React from "react";
import { CreditCard, Activity, CheckCircle2, AlertCircle, Database, ShieldCheck } from "lucide-react";

export default function Navbar({ activeTab, setActiveTab, backendStatus }) {
  return (
    <header style={{
      width: "100%",
      borderBottom: "1px solid var(--bg-card-border)",
      background: "rgba(11, 15, 25, 0.8)",
      backdropFilter: "blur(12px)",
      position: "sticky",
      top: 0,
      zIndex: 50
    }}>
      <div style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px"
      }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
            display: "grid",
            placeItems: "center",
            boxShadow: "0 4px 15px rgba(59, 130, 246, 0.4)"
          }}>
            <CreditCard size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontWeight: 800, fontSize: "19px", letterSpacing: "-0.02em" }}>
                My Store
              </span>
              <span className="badge badge-blue">MERN Stack</span>
            </div>
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              Razorpay Payment Integration
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => setActiveTab("checkout")}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: activeTab === "checkout" ? "1px solid rgba(59, 130, 246, 0.4)" : "1px solid transparent",
              background: activeTab === "checkout" ? "rgba(59, 130, 246, 0.15)" : "transparent",
              color: activeTab === "checkout" ? "#60a5fa" : "var(--text-muted)",
              fontWeight: 600,
              fontSize: "14px",
              cursor: "pointer",
              transition: "var(--transition)"
            }}
          >
            Checkout
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              borderRadius: "8px",
              border: activeTab === "orders" ? "1px solid rgba(59, 130, 246, 0.4)" : "1px solid transparent",
              background: activeTab === "orders" ? "rgba(59, 130, 246, 0.15)" : "transparent",
              color: activeTab === "orders" ? "#60a5fa" : "var(--text-muted)",
              fontWeight: 600,
              fontSize: "14px",
              cursor: "pointer",
              transition: "var(--transition)"
            }}
          >
            <Database size={15} />
            Orders History
          </button>
          <button
            onClick={() => setActiveTab("helper")}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: activeTab === "helper" ? "1px solid rgba(59, 130, 246, 0.4)" : "1px solid transparent",
              background: activeTab === "helper" ? "rgba(59, 130, 246, 0.15)" : "transparent",
              color: activeTab === "helper" ? "#60a5fa" : "var(--text-muted)",
              fontWeight: 600,
              fontSize: "14px",
              cursor: "pointer",
              transition: "var(--transition)"
            }}
          >
            Test Cards
          </button>
        </nav>

        {/* Backend & Mode Badges */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            title={`Backend Status: ${backendStatus}`}
            className={`badge ${backendStatus === "online" ? "badge-green" : backendStatus === "checking" ? "badge-amber" : "badge-red"}`}
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <span style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              backgroundColor: backendStatus === "online" ? "#10b981" : backendStatus === "checking" ? "#f59e0b" : "#ef4444",
              display: "inline-block"
            }} />
            <span>API: {backendStatus}</span>
          </div>

          <div className="badge badge-blue" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <ShieldCheck size={13} />
            <span>Test Mode</span>
          </div>
        </div>
      </div>
    </header>
  );
}
