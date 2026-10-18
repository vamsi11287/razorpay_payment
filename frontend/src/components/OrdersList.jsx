import React, { useState, useEffect } from "react";
import { Database, RefreshCw, CheckCircle2, Clock, AlertTriangle, ArrowLeft } from "lucide-react";
import { fetchRecentOrders } from "../services/api";

export default function OrdersList({ onNewCheckout }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  const loadOrders = async () => {
    setLoading(true);
    const data = await fetchRecentOrders();
    setOrders(data.orders || []);
    if (data.fallbackNotice) {
      setNotice(data.fallbackNotice);
    } else {
      setNotice("");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="glass-panel" style={{
      maxWidth: "850px",
      width: "100%",
      margin: "0 auto",
      padding: "36px 32px"
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px",
        marginBottom: "24px"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Database size={22} color="#60a5fa" />
            <h2 style={{ fontSize: "24px", fontWeight: 800, letterSpacing: "-0.02em" }}>
              Order & Transaction History
            </h2>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "4px" }}>
            Persisted order records synchronized between Razorpay & MongoDB
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={loadOrders}
            className="btn-secondary"
            disabled={loading}
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
          <button
            onClick={onNewCheckout}
            className="btn-secondary"
            style={{ background: "rgba(59, 130, 246, 0.15)", color: "#60a5fa", borderColor: "rgba(59, 130, 246, 0.3)" }}
          >
            + New Checkout
          </button>
        </div>
      </div>

      {notice && (
        <div style={{
          padding: "10px 16px",
          background: "rgba(245, 158, 11, 0.1)",
          border: "1px solid rgba(245, 158, 11, 0.25)",
          borderRadius: "8px",
          color: "#fbbf24",
          fontSize: "12px",
          marginBottom: "20px"
        }}>
          ℹ️ {notice}
        </div>
      )}

      {/* Orders Table */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
          <RefreshCw size={24} className="animate-spin" style={{ margin: "0 auto 12px" }} />
          <p>Fetching records from backend...</p>
        </div>
      ) : orders.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "60px 20px",
          background: "rgba(0, 0, 0, 0.2)",
          borderRadius: "var(--radius-md)",
          border: "1px dashed var(--bg-card-border)"
        }}>
          <p style={{ color: "var(--text-muted)", fontSize: "15px", marginBottom: "16px" }}>
            No orders found yet. Complete your first test payment!
          </p>
          <button onClick={onNewCheckout} className="btn-secondary" style={{ margin: "0 auto" }}>
            Go to Checkout
          </button>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
            fontSize: "13px"
          }}>
            <thead>
              <tr style={{
                borderBottom: "1px solid var(--bg-card-border)",
                color: "var(--text-dim)",
                textTransform: "uppercase",
                fontSize: "11px",
                letterSpacing: "0.05em"
              }}>
                <th style={{ padding: "12px 14px" }}>Status</th>
                <th style={{ padding: "12px 14px" }}>Order ID</th>
                <th style={{ padding: "12px 14px" }}>Payment ID</th>
                <th style={{ padding: "12px 14px" }}>Amount</th>
                <th style={{ padding: "12px 14px" }}>Customer</th>
                <th style={{ padding: "12px 14px" }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((ord, idx) => {
                const isPaid = ord.status === "paid";
                const isFailed = ord.status === "failed";
                return (
                  <tr
                    key={ord.orderId || idx}
                    style={{
                      borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
                      transition: "var(--transition)"
                    }}
                  >
                    <td style={{ padding: "14px" }}>
                      <span className={`badge ${isPaid ? "badge-green" : isFailed ? "badge-red" : "badge-amber"}`}>
                        {ord.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: "14px", fontFamily: "monospace", color: "#e2e8f0" }}>
                      {ord.orderId}
                    </td>
                    <td style={{ padding: "14px", fontFamily: "monospace", color: isPaid ? "#34d399" : "var(--text-dim)" }}>
                      {ord.paymentId || "—"}
                    </td>
                    <td style={{ padding: "14px", fontWeight: 700, color: "#fff" }}>
                      ₹{(ord.amount / 100).toFixed(2)}
                    </td>
                    <td style={{ padding: "14px", color: "var(--text-muted)" }}>
                      {ord.customer?.name || "Guest"}
                    </td>
                    <td style={{ padding: "14px", color: "var(--text-dim)", fontSize: "12px" }}>
                      {new Date(ord.createdAt).toLocaleDateString()} {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
