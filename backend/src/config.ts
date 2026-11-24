import dotenv from "dotenv";
dotenv.config();

// Validate required env vars at startup — AFTER dotenv has loaded
const required = ["JWT_SECRET", "MONGO_URI"] as const;
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const JWT_SECRET = process.env.JWT_SECRET as string;
export const MONGO_URI = process.env.MONGO_URI as string;
