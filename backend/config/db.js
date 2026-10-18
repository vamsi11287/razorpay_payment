const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/razorpay_demo";
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000
    });
    isConnected = true;
    console.log(` MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    isConnected = false;
    console.warn(` MongoDB Connection Notice: Could not connect to MongoDB (${error.message}).`);
    console.warn(" Backend will continue running in in-memory/fallback mode for payments without persistent database storage.");
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };
