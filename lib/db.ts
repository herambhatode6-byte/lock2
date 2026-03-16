import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/myapp";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially.
 */
// @ts-ignore
let cached = global.mongoose ;

if (!cached) {
  // @ts-ignore
  cached = global.mongoose = { conn: null, promise: null };
}

const dbConnect = async () => {
  // If we already have a connection, return it immediately
  if (cached.conn) {
    console.log("Using existing MongoDB connection");
    return cached.conn;
  }

  // If a connection is not already in progress, start one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disables Mongoose buffering if the connection drops
    };

    console.log("Establishing new MongoDB connection...");
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    // Wait for the connection promise to resolve and cache the result
    cached.conn = await cached.promise;
    console.log("MongoDB connected successfully");
  } catch (error) {
    cached.promise = null; // Reset the promise so we can try again on the next request
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }

  return cached.conn;
};

export default dbConnect;