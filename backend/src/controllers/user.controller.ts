import userModel from "../models/User.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { JWT_SECRET } from "../config";

const DEMO_EMAIL = "demo@imagify.app";
const DEMO_PASSWORD = "demo_imagify_2024";
const DEMO_NAME = "Demo User";

const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Credentials missing",
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const saltRounds = 10;
    const hashedpassword = await bcrypt.hash(password, saltRounds);
    const newUser = new userModel({ name, email, password: hashedpassword });
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    return res.status(201).json({
      token,
      user: { name: user.name, id: user._id },
      message: "User Registered successfully",
    });
  } catch (error) {
    console.error("registerUser error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: existingUser._id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.status(200).json({ token, message: "Login successful" });
  } catch (error) {
    console.error("loginUser error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Demo login — no credentials needed.
 * Upserts a shared demo account and returns a short-lived token.
 * Safe for interviewers / portfolio reviewers.
 */
const demoLogin = async (_req: Request, res: Response) => {
  try {
    let demoUser = await userModel.findOne({ email: DEMO_EMAIL });

    if (!demoUser) {
      const hashed = await bcrypt.hash(DEMO_PASSWORD, 10);
      demoUser = await new userModel({
        name: DEMO_NAME,
        email: DEMO_EMAIL,
        password: hashed,
      }).save();
    }

    const token = jwt.sign({ id: demoUser._id }, JWT_SECRET, { expiresIn: "1d" });
    return res.status(200).json({
      token,
      user: { name: demoUser.name, id: demoUser._id },
      message: "Demo login successful",
    });
  } catch (error) {
    console.error("demoLogin error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { loginUser, registerUser, demoLogin };
