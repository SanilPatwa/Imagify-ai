import mongoose from "mongoose";
import { MONGO_URI } from "./config";

const connectDb = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to database");
  } catch (error) {
    console.error("Database connection failed", error);
    process.exit(1);
  }
};

export default connectDb;
