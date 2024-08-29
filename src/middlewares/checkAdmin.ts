import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const checkAdmin = (req: Request, res: Response, next: NextFunction) => {

  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const user = jwt.verify(token, "secretKey") as jwt.JwtPayload;
    if (user.role !== "admin") {
      return res.status(403).json({ message: "You are not an admin" });
    }
    next();
  } catch (error: any) {
    return res.status(403).json({ error: "Invalid token" });
  }
};
