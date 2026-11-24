import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "../config";

const userAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "User is not authorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const tokenDecoded = jwt.verify(token, JWT_SECRET) as { id: string };
    if (!tokenDecoded.id) {
      return res.status(401).json({ message: "Not authorized, please log in again" });
    }
    req.body.userId = tokenDecoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default userAuth;
