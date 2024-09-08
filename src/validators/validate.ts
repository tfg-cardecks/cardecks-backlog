import { Response } from "express";
import bycrypt from "bcrypt";
import { roles } from "../utils/utils";
import { UserCredentials } from "../interfaces/UserCredentials";
import { User } from "../models/user";

export function handleValidateRole(role: string, res: Response) {
  if (!roles.map((r) => r.name).includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }
}

export async function handleValidateUniqueUser(
  credentials: UserCredentials,
  res: Response
) {
  if (
    await User.findOne({
      $or: [{ email: credentials.email }, { username: credentials.username }],
    })
  ) {
    return res.status(400).json({ message: "User already exists" });
  }
}

export function handleValidateEmail(email: string, res: Response) {
  if (!/^\w+([.-]?\w+)*@(gmail|hotmail|outlook)\.com$/.test(email))
    return res.status(400).json({
      message: "Email must be an email from gmail, hotmail or outlook",
    });
}

export function handleValidatePassword(password: string, res: Response) {
  if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/.test(password))
    return res.status(400).json({
      message:
        "Password must have at least one lowercase letter, one uppercase letter, one number and one special character",
    });
}

export function handleValidateLocation(location: string, res: Response) {
  const countries = [
    "Argentina",
    "Australia",
    "Brazil",
    "Canada",
    "China",
    "France",
    "Germany",
    "India",
    "Italy",
    "Japan",
    "Mexico",
    "Russia",
    "South Africa",
    "Spain",
    "United Kingdom",
    "United States",
  ];

  if (!countries.includes(location)) {
    return res.status(400).send({ message: "Invalid location" });
  }
}

export function handleValidationErrors(error: any, res: Response) {
  const keyError = error.message.split(":");
  console.log("keyError", keyError);
  return res.status(400).json({
    atributeError: keyError[1].trim(),
    message: keyError[2].trim().split(",")[0],
  });
}

export const handleValidateTypeOfUser = (typeOfUser: string, res: Response): boolean => {
  const typesOfUser = [
    "Student",
    "Teacher",
    "Other",
  ];
  
  if (!typesOfUser.includes(typeOfUser)) {
    res.status(400).json({ message: `Invalid typeOfUser: ${typeOfUser}` });
    return true;
  }
  return false;
};

export async function checkPassword(
  password: string,
  res: Response,
  user: any
) {
  const matchPassword = await bycrypt.compare(password, user.password);
  if (!matchPassword)
    return res.status(401).json({ message: "Invalid password" });
}
