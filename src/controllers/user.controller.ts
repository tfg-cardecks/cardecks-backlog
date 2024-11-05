import { Request, Response } from "express";
import bcrypt from "bcrypt";

// local imports
import { User } from "../models/user";
import { Card } from "../models/card";
import { Deck } from "../models/deck";
import { Game } from "../models/game";
import { WordSearchGame } from "../models/games/wordSearchGame";
import {
  handleValidateEmail,
  handleValidateUniqueUser,
  handleValidatePassword,
} from "../validators/validate";

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const gameType = "WordSearchGame";
    const totalGamesCompleted = user.gamesCompletedByType.get(gameType) || 0;

    return res.status(200).json({ ...user.toObject(), totalGamesCompleted });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await Card.deleteMany({ _id: { $in: user.cards } });
    await Deck.deleteMany({ _id: { $in: user.decks } });
    await Game.deleteMany({ _id: { $in: user.games } });
    await WordSearchGame.deleteMany({ user: id });
    await User.findByIdAndDelete(id);

    return res.status(204).json({ message: "Usuario eliminado" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { username, email } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const updateData: any = {};
    if (username && username !== user.username) updateData.username = username;
    if (email && email !== user.email) updateData.email = email;

    if (updateData.username || updateData.email) {
      if (await handleValidateUniqueUser(updateData, res)) return;
    }

    if (updateData.email && handleValidateEmail(updateData.email, res)) return;

    const updatedUser = await User.findOneAndUpdate({ _id: id }, updateData, {
      new: true,
    });
    return res.status(200).json(updatedUser);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateUserPassword = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña actual incorrecta" });
    }
    if (handleValidatePassword(newPassword, res)) return;

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res
      .status(200)
      .json({ message: "Contraseña actualizada con éxito" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
