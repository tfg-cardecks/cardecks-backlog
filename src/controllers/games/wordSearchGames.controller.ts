import { Response, Request } from "express";

// local imports
import { Game } from "../../models/game";
import { WordSearchGame } from "../../models/games/wordSearchGame";
import { User } from "../../models/user";
import { Deck } from "../../models/deck";
import { handleValidationErrors } from "../../validators/validate";
import { CustomRequest } from "../../interfaces/customRequest";
import { generateWordSearchGrid } from "../../utils/wordSearchGenerator";

export const getWordSearchGames = async (_req: Request, res: Response) => {
  try {
    const wordSearchGames = await WordSearchGame.find();
    res.status(200).json(wordSearchGames);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const getWordSearchGameById = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const wordSearchGame = await WordSearchGame.findById(
      req.params.id
    ).populate("game");
    if (!wordSearchGame) {
      return res.status(404).json({ message: "Sopa de letras no encontrada" });
    }
    return res.status(200).json(wordSearchGame);
  } catch (error: any) {
    return res.status(500).json({ message: error });
  }
};

export const createWordSearchGame = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { deckId, settings } = req.body;
    const userId = req.user?.id;

    if (!deckId)
      return res.status(400).json({ message: "Mazo no proporcionado" });

    if (!userId)
      return res.status(401).json({ message: "Usuario no autenticado" });

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    if (!user.gamesCompletedByType) {
      user.gamesCompletedByType = new Map<string, number>();
      await user.save();
    }

    const deck = await Deck.findById(deckId).populate("cards");
    if (!deck) return res.status(404).json({ message: "Mazo no encontrado" });

    const words = deck.cards
      .flatMap((card: any) =>
        card.frontSide.text.map((textObj: any) => textObj.content.toUpperCase())
      )
      .filter((text: string) => text.length <= 9);

    if (words.length < 5)
      return res.status(400).json({
        message:
          "El mazo no tiene suficientes palabras válidas para crear una nueva sopa de letras",
      });

    const selectedWords = getRandomWords(words, settings?.maxWords || 2);
    const { grid, error } = generateWordSearchGrid(
      selectedWords,
      10,
      settings?.maxWords || 2
    );

    if (error) {
      return res.status(400).json({ message: error });
    }

    const gameType = "WordSearchGame";
    const maxGames = settings?.totalGames || 1;

    const game = new Game({
      name: "Sopa de letras",
      user: userId,
      gameType: gameType,
      currentGameCount: 0,
      totalGames: maxGames,
      completed: false,
      deck: deckId,
    });

    await game.save();
    user.games.push(game._id);
    await user.save();

    const wordSearchGame = new WordSearchGame({
      game: game._id,
      user: userId,
      deck: deckId,
      grid,
      words: selectedWords,
      duration: settings?.duration || 60,
      maxWords: settings?.maxWords || 2,
      status: "inProgress",
    });

    await wordSearchGame.save();

    game.currentGameCount += 1;
    await game.save();

    return res.status(201).json({
      message: "Juego creado con éxito",
      game,
      wordSearchGame,
      currentGame: game.currentGameCount,
      totalGames: maxGames,
    });
  } catch (error: any) {
    handleValidationErrors(error, res);
  }
};

function getRandomWords(words: string[], count: number): string[] {
  const shuffled = words.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export const completeCurrentGame = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { wordSearchGameId } = req.params;
    const userId = req.user?.id;
    const wordSearchGame = await WordSearchGame.findById(
      wordSearchGameId
    ).populate("game");
    if (!wordSearchGame) {
      return res.status(404).json({ error: "Sopa de letras no encontrada" });
    }

    if (req.body.foundWords) wordSearchGame.foundWords = req.body.foundWords;
    const allWordsFound = wordSearchGame.words.every((word) =>
      wordSearchGame.foundWords.includes(word)
    );

    if (!allWordsFound && req.body.forceComplete) {
      return handleIncompleteGame(req, res, wordSearchGame);
    }

    wordSearchGame.status = "completed";
    await wordSearchGame.save();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    if (!user.gamesCompletedByType)
      user.gamesCompletedByType = new Map<string, number>();
    if (!user.totalGamesCompletedByType)
      user.totalGamesCompletedByType = new Map<string, number>();

    const gameType = "WordSearchGame";
    const currentCount = user.gamesCompletedByType.get(gameType) || 0;
    const totalCount = user.totalGamesCompletedByType.get(gameType) || 0;

    const game = await Game.findById(wordSearchGame.game);
    if (!game) {
      return res.status(404).json({ message: "Juego no encontrado" });
    }

    const maxGames = game.totalGames;

    user.gamesCompletedByType.set(gameType, currentCount + 1);
    user.totalGamesCompletedByType.set(gameType, totalCount + 1);
    await user.save();

    game.currentGameCount += 1;

    if (game.currentGameCount > maxGames) {
      game.completed = true;
      await game.save();
      return res.status(200).json({
        message: `¡Felicidades! Has completado las ${maxGames} partidas de ${gameType}.`,
        currentGame: game.currentGameCount,
        totalGames: maxGames,
      });
    }

    await game.save();

    const deck = await Deck.findById(wordSearchGame.deck).populate("cards");
    if (!deck) return res.status(404).json({ message: "Mazo no encontrado" });

    const words = deck.cards
      .flatMap((card: any) =>
        card.frontSide.text.map((textObj: any) => textObj.content.toUpperCase())
      )
      .filter((text: string) => text.length <= 9);

    if (words.length < 5)
      return res.status(400).json({
        message:
          "El mazo no tiene suficientes palabras válidas para crear una nueva sopa de letras",
      });

    const selectedWords = getRandomWords(words, wordSearchGame.maxWords);
    const { grid, error } = generateWordSearchGrid(
      selectedWords,
      10,
      wordSearchGame.maxWords
    );

    if (error) {
      return res.status(400).json({ message: error });
    }

    const newWordSearchGame = new WordSearchGame({
      game: wordSearchGame.game,
      user: userId,
      deck: wordSearchGame.deck,
      grid,
      words: selectedWords,
      duration: wordSearchGame.duration,
      maxWords: wordSearchGame.maxWords,
      status: "inProgress",
    });

    await newWordSearchGame.save();
    return res.status(201).json({
      gameId: wordSearchGame.game,
      wordSearchGameId: newWordSearchGame._id,
      currentGame: game.currentGameCount,
      totalGames: maxGames,
    });
  } catch (error: any) {
    handleValidationErrors(error, res);
  }
};

const handleIncompleteGame = async (
  req: CustomRequest,
  res: Response,
  wordSearchGame: InstanceType<typeof WordSearchGame>
) => {
  const game = await Game.findById(wordSearchGame.game);
  if (!game) {
    return res.status(404).json({ message: "Juego no encontrado" });
  }
  if (req.body.forceComplete) {
    await completeGamewordSearchGame(wordSearchGame);
    return res.status(200).json({
      message: "Juego completado forzosamente",
      reason: "forceComplete",
    });
  } else {
    if (game.currentGameCount >= game.totalGames) {
      await completeGamewordSearchGame(wordSearchGame);
      return res.status(200).json({
        message: "Juego completado forzosamente",
        reason: "maxGamesReached",
      });
    } else {
      return res.status(200).json({
        message: "Juego incompleto",
        nextGame: true,
        wordSearchGameId: wordSearchGame._id,
      });
    }
  }
};

const completeGamewordSearchGame = async (
  wordSearchGame: InstanceType<typeof WordSearchGame>
) => {
  wordSearchGame.status = "completed";
  await wordSearchGame.save();
};

export const deleteWordSearchGame = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { wordSearchGameId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    if (!wordSearchGameId) {
      return res
        .status(400)
        .json({ error: "El ID del juego de sopa de letras es obligatorio" });
    }

    const wordSearchGame = await WordSearchGame.findByIdAndDelete(
      wordSearchGameId
    );
    if (!wordSearchGame) {
      return res.status(404).json({ error: "Sopa de letras no encontrada" });
    }

    await Game.findByIdAndDelete(wordSearchGame.game);

    if (wordSearchGame.status === "completed") {
      const user = await User.findById(userId);
      if (user) {
        const gameType = "WordSearchGame";
        const currentCount = user.gamesCompletedByType.get(gameType) || 0;

        if (currentCount > 0) {
          user.gamesCompletedByType.set(gameType, currentCount - 1);
          await user.save();
        }
      }
    }

    return res.status(204).send();
  } catch (error: any) {
    handleValidationErrors(error, res);
  }
};
