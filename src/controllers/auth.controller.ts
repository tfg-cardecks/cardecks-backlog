import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bycrypt from "bcrypt";
import {
  checkPassword,
  handleValidateEmail,
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
  const { email, username, password, role } = req.body;
  if (handleValidateRole(role, res)) return;
  if (await handleValidateUniqueUser({ email, username }, res)) return;
  if (handleValidateEmail(email, res)) return;
  if (handleValidatePassword(password, res)) return;
  try {
    await registerUser(req, res);
  } catch (error: any) {
    handleValidationErrors(error, res);
  }
};

export const signin = async (req: Request, res: Response) => {
  const { emailOrUsername, password } = req.body;

  if (!password)
    return res.status(400).json({ message: "La contraseña es obligatoria" });
  const userFound = await getUserByEmailOrUsername(
    emailOrUsername,
    emailOrUsername
  );
  if (!userFound)
    return res.status(404).json({ message: "Usuario no encontrado" });

  if (await checkPassword(password, res, userFound)) return;

  const token = jwt.sign(
    { id: userFound._id, role: userFound.role, username: userFound.username },
    "secretKey",
    {
      expiresIn: 86400, // 24 hours
      algorithm: "HS512",
    }
  );

  const isNewUser = userFound.isNewUser;
  if (isNewUser) {
    userFound.isNewUser = false;
    await userFound.save();
  }

  return res.status(200).json({
    token: token,
    role: userFound.role,
    username: userFound.username,
    id: userFound._id,
    isNewUser,
  });
};
