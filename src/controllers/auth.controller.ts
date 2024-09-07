import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bycrypt from "bcrypt";
import {
  checkPassword,
  handleValidateEmail,
  handleValidateLocation,
  handleValidatePassword,
  handleValidateRole,
  handleValidateUniqueUser,
  handleValidationErrors,
} from "../validators/validate";
import { User } from "../models/user";
import { getUserByEmailOrUsername } from "../utils/utils";

async function registerUser(req: Request, res: Response) {
  const newUser = new User(req.body);
  newUser.password = await bycrypt.hash(newUser.password, 10);
  await newUser.save();
  return res.status(201).json({ message: `${newUser}` });
}

export const signup = async (req: Request, res: Response) => {
  const { email, username, password, location, role } = req.body;
  if (handleValidateRole(role, res)) return;
  if (await handleValidateUniqueUser({ email, username }, res)) return;
  if (handleValidateEmail(email, res)) return;
  if (handleValidateLocation(location, res)) return;
  if (handleValidatePassword(password, res)) return;
  try {
    //if (role === "admin") {
    //pasarela de pago
    //} else {
    await registerUser(req, res);
    //}
  } catch (error: any) {
    handleValidationErrors(error, res);
  }
};

export const signin = async (req: Request, res: Response) => {
  const userFound = await getUserByEmailOrUsername(
    req.body.email,
    req.body.username
  );
  if (!req.body.password)
    return res.status(400).json({ message: "Password is required" });
  if (!userFound) return res.status(404).json({ message: "User not found" });
  if (await checkPassword(req.body.password, res, userFound)) return;

  const token = jwt.sign(
    { id: userFound._id, role: userFound.role, username: userFound.username },
    "secretKey",
    {
      expiresIn: 86400, // 24 hours
      algorithm: "HS512",
    }
  );
  return res
    .status(200)
    .json({ token: token, role: userFound.role, username: userFound.username, id: userFound._id });
};
