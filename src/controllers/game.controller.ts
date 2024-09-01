import { Request, Response } from "express";

// local imports
import { Game } from "../models/game";

export const getGames = async (_req: Request, res: Response) => {
  try {
    const games = await Game.find();
    return res.json(games);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getGameById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const game = await Game.findById(id);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }
    return res.json(game);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteGame = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const game = await Game.findByIdAndDelete(id);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }
    return res.status(204).json({ message: "Game deleted" }); 
    
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
