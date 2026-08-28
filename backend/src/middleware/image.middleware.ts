import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const userAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "User is not authorized" });
  }

  const token = authHeader.split(" ")[1];
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  try {
    const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET) as {
      id: string;
    };
    if (tokenDecoded.id) {
      req.body.userId = tokenDecoded.id;
    } else {
      return res.json({
        message: "Not authorized login again",
      });
    }
    next();
  } catch (error) {
    return res.json({
      message: "Invalid or Expired token",
    });
  }
};

export default userAuth;
