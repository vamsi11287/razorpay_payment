# Razorpay MERN Frontend (React + Vite)

A modern, responsive, high-end React frontend built with Vite for Razorpay checkout, real-time verification, MongoDB transaction history, and test card helper.

---

## 🚀 Features

- **Dynamic Checkout**: Interactive amount selection, customizable customer details, and 1-click Razorpay checkout.
- **Real-Time Verification**: Automatically sends signature and payment ID to backend and displays animated verified confirmation.
- **MongoDB Order History**: Real-time table displaying recorded transactions from backend `/api/orders`.
- **Test Mode Helper**: Built-in 1-click copy for Razorpay test cards, OTPs, and test UPI handles.
- **Configurable API Endpoint**: Seamlessly connects to any backend URL via `VITE_API_URL`.

---

## 🛠️ Environment Configuration

Create a `.env` file in the `frontend/` directory:

```env
# Backend API Base URL
# Deployed on Render:
VITE_API_URL=https://razorpay-payment-1.onrender.com

# Local (if testing local backend):
# VITE_API_URL=http://localhost:5000
```

---

## 📦 Local Development

```bash
cd frontend
npm install
npm run dev     # Starts Vite dev server (usually http://localhost:5173)
```

---

## 🌐 Hosting Frontend Separately (e.g. Vercel / Netlify)

1. **Deploy Repository**:
   - In Vercel or Netlify, import your GitHub repository.
   - Set **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
2. **Set Environment Variables**:
   - `VITE_API_URL`: `https://razorpay-payment-1.onrender.com`
