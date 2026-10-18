# Razorpay MERN Backend API

A production-ready Node.js, Express, MongoDB, and Razorpay backend service designed for independent cloud hosting (e.g., Render, Railway, Heroku, AWS, DigitalOcean).

---

## 🚀 Features

- **Order Creation API** (`POST /api/create-order`): Creates Razorpay orders with server-side validation and tracks them in MongoDB.
- **Payment Verification API** (`POST /api/verify-payment`): Validates HMAC-SHA256 signatures and verifies payment capture directly with Razorpay API.
- **Persistent Transactions** (`GET /api/orders`): Stored order histories with Mongoose schema, supporting status updates (`created`, `paid`, `failed`).
- **Resilient Fallback**: Gracefully operates even without local MongoDB for rapid testing.
- **CORS Configured**: Ready for separate frontend domain hosting via `CLIENT_URL`.
- **Health Check Endpoint** (`GET /api/health`): For uptime monitoring and deployment probes.

---

## 🛠️ Environment Configuration

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
NODE_ENV=development

# Razorpay Test / Live Keys
RAZORPAY_KEY_ID=rzp_test_YourKeyIdHere
RAZORPAY_KEY_SECRET=YourKeySecretHere

# MongoDB Connection String (Atlas URI or local)
MONGODB_URI=mongodb://127.0.0.1:27017/razorpay_demo

# Allowed Frontend URL for CORS
CLIENT_URL=http://localhost:5173
```

---

## 📦 Local Development

```bash
cd backend
npm install
npm run dev    # Starts with nodemon on port 5000
# or
npm start      # Standard node server.js
```

---

## 🌐 Hosting Backend Separately (e.g. Render / Railway)

1. **Deploy Repository**:
   - In Render/Railway, connect your Git repository.
   - Set **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
2. **Set Environment Variables**:
   - `PORT`: `5000` (or leave default assigned by platform)
   - `RAZORPAY_KEY_ID`: Your Razorpay Key ID
   - `RAZORPAY_KEY_SECRET`: Your Razorpay Key Secret
   - `MONGODB_URI`: Your MongoDB Atlas connection URI
   - `CLIENT_URL`: Your hosted frontend URL (e.g., `https://my-store.vercel.app`)
