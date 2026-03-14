import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/myapp";

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

const dbConnect = async () => {
  // readyState 1 means completely connected. readyState 2 means connecting.
  // If it's already connected or in the process of connecting, return immediately.
  if (mongoose.connection.readyState >= 1) {
    console.log("Using existing MongoDB connection");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("New connection to MongoDB established");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

export default dbConnect;