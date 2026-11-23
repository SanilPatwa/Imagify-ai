import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import connectDb from "./db";
import userRouter from "./routes/userRoutes";
import imageRouter from "./routes/image.routes";

dotenv.config();
connectDb();

const app = express();
app.use(cors());
app.use(express.json());

// Health check route - touches MongoDB Atlas to keep Render and MongoDB active
app.get(["/health", "/api/health"], async (req: Request, res: Response) => {
  try {
    if (!mongoose.connection.db) {
      return res.status(503).json({
        ok: false,
        status: "error",
        database: "disconnected",
        message: "Database connection not initialized"
      });
    }
    await mongoose.connection.db.admin().ping();
    return res.status(200).json({
      ok: true,
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: "connected"
    });
  } catch (error: any) {
    console.error("Health check error:", error);
    return res.status(500).json({
      ok: false,
      status: "error",
      database: "disconnected",
      error: error?.message || "Database ping failed"
    });
  }
});

app.use("/api/user", userRouter);
app.use("/api/images", imageRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
