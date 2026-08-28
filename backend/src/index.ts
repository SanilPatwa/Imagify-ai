import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./db";
import userRouter from "./routes/userRoutes";
import imageRouter from "./routes/image.routes";

dotenv.config();
connectDb();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/images", imageRouter);

app.listen(3000, () => {
  console.log("App is listening");
});
