const API_BASE = import.meta.env.VITE_API_URL || "https://razorpay-payment-1.onrender.com";

/**
 * Health check to verify backend connectivity
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/api/health`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    if (!res.ok) throw new Error(`Health check returned status ${res.status}`);
    return await res.json();
  } catch (error) {
    return { status: "error", error: error.message };
  }
}

/**
 * Creates an order on the backend
 */
export async function createOrder(data = {}) {
  const res = await fetch(`${API_BASE}/api/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || `Order creation failed with status ${res.status}`);
  }
  return json;
}

/**
 * Verifies the payment signature and status with the backend
 */
export async function verifyPayment(paymentPayload) {
  const res = await fetch(`${API_BASE}/api/verify-payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(paymentPayload)
  });

  const json = await res.json();
  if (!res.ok || !json.verified) {
    throw new Error(json.error || "Payment verification failed.");
  }
  return json;
}

/**
 * Fetches recent orders stored in MongoDB
 */
export async function fetchRecentOrders() {
  try {
    const res = await fetch(`${API_BASE}/api/orders`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    if (!res.ok) throw new Error("Could not fetch orders");
    return await res.json();
  } catch (error) {
    console.error("Error fetching orders:", error);
    return { success: false, orders: [] };
  }
}
