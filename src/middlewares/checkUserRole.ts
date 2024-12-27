import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomRequest } from "../interfaces/customRequest";

export const checkUserRol = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;

  if (!token) {
    return res
      .status(401)
      .json({ error: "Debes iniciar sesión para usar esta función" });
  }
  try {
    const user = jwt.verify(token, "secretKey") as jwt.JwtPayload;

    if (user.role === "anonymous") {
      return res
        .status(403)
        .json({ message: "Debes iniciar sesión para usar esta función" });
    }
    req.user = user;

    next();
  } catch (error: any) {
    return res.status(403).json({ error: "Token inválido" });
  }
};