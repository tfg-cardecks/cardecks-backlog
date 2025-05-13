import { Response, Request } from "express";

// local imports
import { Game } from "../../models/game";
import { LetterOrderGame } from "../../models/games/letterOrderGame";
import { User } from "../../models/user";
import { Deck } from "../../models/deck";
import { handleValidationErrors } from "../../validators/validate";
import { CustomRequest } from "../../interfaces/customRequest";

function cleanWord(word: string): string {
  const withoutSpaces = word.replace(/\s+/g, "");
  const withoutAccents = withoutSpaces
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return withoutAccents.replace(/[^A-Z]/gi, "").toUpperCase();
}

export const getLetterOrderGames = async (_req: Request, res: Response) => {
  try {
    const letterOrderGames = await LetterOrderGame.find();
    res.status(200).json(letterOrderGames);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const getLetterOrderGameById = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const letterOrderGame = await LetterOrderGame.findById(
      req.params.id
    ).populate("game");
    if (!letterOrderGame) {
      return res
        .status(404)
        .json({ message: "Juego de Ordenar Letras no encontrado" });
    }
    return res.status(200).json(letterOrderGame);
  } catch (error: any) {
    return res.status(500).json({ message: error });
  }
};

export const createLetterOrderGame = async (
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
        card.frontSide.text.map((textObj: any) => cleanWord(textObj.content))
      )
      .filter(
        (text: string, index, self) =>
          text.length > 0 && text.length <= 9 && self.indexOf(text) === index
      );

    if (words.length < 8)
      return res.status(400).json({
        message:
          "El mazo no tiene suficientes palabras válidas para crear un nuevo Juego de Ordenar Letras",
      });

    const gameType = "LetterOrderGame";
    const maxGames = settings?.totalGames || 1;

    const game = new Game({
      name: "Ordenar Letras",
      description:
        "Un juego interactivo donde debes ordenar las Letras para formar la palabra correcta.",
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

    const selectedWords = getRandomWords(words, settings?.numWords || 1);

    const letterOrderGame = new LetterOrderGame({
      game: game._id,
      user: userId,
      deck: deck._id,
      words: selectedWords.map((word: string) => ({
        grid: shuffleArray(word.split("")),
        word: word,
        foundLetters: [],
        status: "inProgress",
      })),
      numWords: selectedWords.length,
      duration: settings?.duration || 60,
      status: "inProgress",
    });

    await letterOrderGame.save();

    game.currentGameCount += 1;
    await game.save();
    return res.status(201).json({
      message: "Juego creado con éxito",
      game,
      letterOrderGame,
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

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export const completeCurrentGame = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { letterOrderGameId } = req.params;
    const userId = req.user?.id;
    const { countAsCompleted = true, forceComplete = false } = req.body;

    const letterOrderGame = await LetterOrderGame.findById(
      letterOrderGameId
    ).populate("game");
    if (!letterOrderGame)
      return res
        .status(404)
        .json({ error: "Juego de Ordenar Letras no encontrado" });

    const allWordsCompleted = letterOrderGame.words.every(
      (word) => word.status === "completed"
    );

    if (!allWordsCompleted && forceComplete) {
      return handleIncompleteGame(req, res, letterOrderGame);
    }

    if (countAsCompleted) {
      letterOrderGame.status = "completed";
      await letterOrderGame.save();

      const user = await User.findById(userId);
      if (!user)
        return res.status(404).json({ error: "Usuario no encontrado" });
      if (!user.gamesCompletedByType)
        user.gamesCompletedByType = new Map<string, number>();
      if (!user.totalGamesCompletedByType)
        user.totalGamesCompletedByType = new Map<string, number>();

      const gameType = "LetterOrderGame";
      const currentCount = user.gamesCompletedByType.get(gameType) || 0;
      const totalCount = user.totalGamesCompletedByType.get(gameType) || 0;

      const game = await Game.findById(letterOrderGame.game);
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

      const deck = await Deck.findById(letterOrderGame.deck).populate("cards");
      if (!deck) return res.status(404).json({ error: "Mazo no encontrado" });

      const words = deck.cards
        .flatMap((card: any) =>
          card.frontSide.text.map((textObj: any) => cleanWord(textObj.content))
        )
        .filter(
          (text: string, index, self) =>
            text.length > 0 && text.length <= 9 && self.indexOf(text) === index
        );

      if (words.length < 8)
        return res.status(400).json({
          message:
            "El mazo no tiene suficientes palabras válidas para crear un nuevo Juego de Ordenar Letras",
        });

      const selectedWords = getRandomWords(words, letterOrderGame.numWords);

      const newLetterOrderGame = new LetterOrderGame({
        game: letterOrderGame.game,
        user: letterOrderGame.user,
        deck: deck._id,
        words: selectedWords.map((word: string) => ({
          grid: shuffleArray(word.split("")),
          word: word,
          foundLetters: [],
          status: "inProgress",
        })),
        numWords: selectedWords.length,
        duration: letterOrderGame.duration,
        status: "inProgress",
      });

      await newLetterOrderGame.save();
      return res.status(201).json({
        gameId: letterOrderGame.game,
        letterOrderGameId: newLetterOrderGame._id,
        currentGame: game.currentGameCount,
        totalGames: maxGames,
      });
    }
  } catch (error: any) {
    handleValidationErrors(error, res);
  }
};

const handleIncompleteGame = async (
  req: CustomRequest,
  res: Response,
  letterOrderGame: InstanceType<typeof LetterOrderGame>
) => {
  const game = await Game.findById(letterOrderGame.game);
  if (!game) {
    return res.status(404).json({ message: "Juego no encontrado" });
  }
  if (req.body.forceComplete) {
    await completeLetterOrderGame(letterOrderGame);
    return res.status(200).json({
      message: "Juego completado forzosamente",
      nextGame: true,
      reason: "forceComplete",
    });
  } else {
    if (game.currentGameCount >= game.totalGames) {
      await completeLetterOrderGame(letterOrderGame);
      return res.status(200).json({
        message: "Juego completado forzosamente",
        reason: "maxGamesReached",
      });
    } else {
      return res.status(200).json({
        message: "Juego incompleto",
        nextGame: true,
        letterOrderGameId: letterOrderGame._id,
      });
    }
  }
};

const completeLetterOrderGame = async (
  letterOrderGame: InstanceType<typeof LetterOrderGame>
) => {
  letterOrderGame.status = "completed";
  await letterOrderGame.save();
};

export const deleteLetterOrderGame = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { letterOrderGameId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    if (!letterOrderGameId) {
      return res.status(400).json({
        error: "El ID del Juego de Ordenar Letras es obligatorio",
      });
    }

    const letterOrderGame = await LetterOrderGame.findByIdAndDelete(
      letterOrderGameId
    );
    if (!letterOrderGame) {
      return res
        .status(404)
        .json({ error: "Juego de Ordenar Letras no encontrado" });
    }

    await Game.findByIdAndDelete(letterOrderGame.game);

    if (letterOrderGame.status == "completed") {
      const user = await User.findById(userId);
      if (user) {
        const gameType = "LetterOrderGame";
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
