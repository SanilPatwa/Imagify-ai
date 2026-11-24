import express from "express";
import { registerUser, loginUser, demoLogin } from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/demo", demoLogin); // No auth — for portfolio/interviewer access

export default userRouter;
