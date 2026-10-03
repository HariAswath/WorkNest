import dotenv from "dotenv";
import app from "../src/app.js";
import mongoose from "mongoose";

dotenv.config();

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    isConnected = true;
    return;
  }
  if (!process.env.MONGO_URL) {
    console.error("MONGO_URL is missing in environment variables");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URL);
    isConnected = true;
  } catch (error) {
    console.error("MongoDB Serverless Connection Error:", error);
  }
};

export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}
