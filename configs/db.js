import mongoose from "mongoose";

let isEventListenersSet = false;

const connectDB = async () => {
  try {
    if (!isEventListenersSet) {
      mongoose.connection.on('connected', () => {
        console.log("✅ MongoDB connected successfully.");
      });
      mongoose.connection.on('error', (err) => {
        console.error("❌ MongoDB connection error:", err);
      });
      mongoose.connection.on('disconnected', () => {
        console.warn("⚠️ MongoDB disconnected.");
      });
      isEventListenersSet = true;
    }

    await mongoose.connect(`${process.env.MONGODB_URI}/greencart`);
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    throw error;
  }
};

export default connectDB;