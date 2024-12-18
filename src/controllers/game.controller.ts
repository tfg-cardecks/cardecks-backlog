import { Request, Response } from "express";

// local imports
import { Game } from "../models/game";
import { WordSearchGame } from "../models/games/wordSearchGame";
import { HangmanGame } from "../models/games/hangmanGame";
import { GuessTheImageGame } from "../models/games/guessTheImageGame";
import { User } from "../models/user";

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
      return res.status(404).json({ message: "Juego no encontrado" });
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
      return res.status(404).json({ message: "Juego no encontrado" });
    }

    if (game.gameType === "WordSearchGame") {
      await WordSearchGame.deleteMany({ game: id });
    } else if (game.gameType === "HangmanGame") {
      await HangmanGame.deleteMany({ game: id });
    } else if (game.gameType === "GuessTheImageGame") {
      await GuessTheImageGame.deleteMany({ game: id });
    }

    await User.updateMany({ games: id }, { $pull: { games: id } });

    return res
      .status(204)
      .json({ message: "Juego y partidas asociadas eliminados" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};