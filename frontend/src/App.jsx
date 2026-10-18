import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import CheckoutCard from "./components/CheckoutCard";
import SuccessModal from "./components/SuccessModal";
import FailureModal from "./components/FailureModal";
import OrdersList from "./components/OrdersList";
import TestCardsModal from "./components/TestCardsModal";
import { checkBackendHealth } from "./services/api";

export default function App() {
  const [activeTab, setActiveTab] = useState("checkout");
  const [checkoutState, setCheckoutState] = useState("idle"); // 'idle' | 'success' | 'failure'
  const [successData, setSuccessData] = useState(null);
  const [failureReason, setFailureReason] = useState("");
  const [backendStatus, setBackendStatus] = useState("checking");

  useEffect(() => {
    let isMounted = true;
    const verifyHealth = async () => {
      const res = await checkBackendHealth();
      if (!isMounted) return;
      if (res && res.status === "ok") {
        setBackendStatus("online");
      } else {
        setBackendStatus("offline");
      }
    };

    verifyHealth();
    const interval = setInterval(verifyHealth, 12000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handlePaymentSuccess = (details) => {
    setSuccessData(details);
    setCheckoutState("success");
  };

  const handlePaymentFailure = (reason) => {
    setFailureReason(reason);
    setCheckoutState("failure");
  };

  const resetToCheckout = () => {
    setCheckoutState("idle");
    setSuccessData(null);
    setFailureReason("");
    setActiveTab("checkout");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setCheckoutState("idle");
        }}
        backendStatus={backendStatus}
      />

      {/* Main Body */}
      <main style={{
        flex: 1,
        display: "grid",
        placeItems: "center",
        padding: "40px 20px"
      }}>
        {checkoutState === "success" ? (
          <SuccessModal
            data={successData}
            onReset={resetToCheckout}
            onViewOrders={() => {
              setCheckoutState("idle");
              setActiveTab("orders");
            }}
          />
        ) : checkoutState === "failure" ? (
          <FailureModal
            reason={failureReason}
            onRetry={resetToCheckout}
          />
        ) : activeTab === "orders" ? (
          <OrdersList onNewCheckout={resetToCheckout} />
        ) : activeTab === "helper" ? (
          <TestCardsModal onBackToCheckout={resetToCheckout} />
        ) : (
          <CheckoutCard
            onSuccess={handlePaymentSuccess}
            onFailure={handlePaymentFailure}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid var(--bg-card-border)",
        padding: "20px 24px",
        textAlign: "center",
        fontSize: "13px",
        color: "var(--text-dim)",
        background: "rgba(11, 15, 25, 0.7)"
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <span>MERN Razorpay Checkout Architecture • Ready for Separate Hosting</span>
          <div style={{ display: "flex", gap: "16px" }}>
            <span style={{ color: "var(--text-muted)" }}>Frontend: React + Vite</span>
            <span style={{ color: "var(--text-muted)" }}>Backend: Express + MongoDB</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
