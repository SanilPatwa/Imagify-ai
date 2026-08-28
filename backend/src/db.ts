import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("Uri is not defined");
    }
    await mongoose.connect(uri);
    console.log("Connected to database");
  } catch (error) {
    console.error("Database connection failed", error);
    process.exit(1);
  }
};

export default connectDb;
