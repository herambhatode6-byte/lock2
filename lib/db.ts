import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/myapp";

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

// 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
const connectionState = mongoose.connection.readyState;

if (connectionState === 1) {
  console.log("Already connected to MongoDB");
} else {
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
}