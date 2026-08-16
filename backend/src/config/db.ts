import mongoose from "mongoose";
import env from "./env.js";

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.mongoUri);
    console.log(`✅  MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌  MongoDB connection failed: ${(error as Error).message}`);
    process.exit(1);
  }
};

export default connectDB;
