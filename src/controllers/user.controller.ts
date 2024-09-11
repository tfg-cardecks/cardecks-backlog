import { Request, Response } from "express";

// local imports
import { User } from "../models/user";
import { Card } from "../models/card";
import { Deck } from "../models/deck";
import { Game } from "../models/game";
import { WordSearchGame } from "../models/games/wordSearchGame";

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
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    return res.json(user);
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