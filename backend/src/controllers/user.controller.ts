import userModel from "../models/User.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({
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
    const userData = {
      name,
      email,
      password: hashedpassword,
    };
    const newUser = new userModel(userData);
    const user = await newUser.save();
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      token,
      user: { name: user.name, id: user._id },
      message: "User Registered successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res.json({ message: "User does not exists" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (isMatch) {
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
      }
      const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.json({ token, message: "Login successful" });
    } else {
      return res.json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
  }
};

export { loginUser, registerUser };
