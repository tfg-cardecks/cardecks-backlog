import { Response, Request } from "express";

//local imports
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
    const wordSearchGame = await WordSearchGame.findById(req.params.id);
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
    const { deckId } = req.body;
    const userId = req.user?.id;

    if (!deckId)
      return res.status(400).json({ message: "Mazo no proporcionado" });

    if (!userId)
      return res.status(401).json({ message: "Usuario no autenticado" });

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    if (!user.gamesCompletedByType)
      user.gamesCompletedByType = new Map<string, number>();

    const gameType = "WordSearchGame";
    const currentCount = user.gamesCompletedByType.get(gameType) || 0;

    const maxGames = 25;

    if (currentCount >= maxGames) {
      return res.status(400).json({
        message: `Ya has completado ${maxGames} juegos de Sopa de Letras. Por favor, reinicia el contador para comenzar una nueva serie.`,
      });
    }

    let game = await Game.findOne({
      user: userId,
      gameType: gameType,
      _id: {
        $in: await WordSearchGame.find({
          user: userId,
          status: "inProgress",
        }).distinct("game"),
      },
    });

    if (game) {
      const wordSearchGame = await WordSearchGame.findOne({
        game: game._id,
        user: userId,
        status: "inProgress",
      });

      return res.status(200).json({
        message: "Ya tienes una sopa de letras en progreso",
        wordSearchGameId: wordSearchGame?._id,
      });
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

    const selectedWords = getRandomWords(words, 4);
    const { grid, error } = generateWordSearchGrid(selectedWords, 10);

    if (error) {
      return res.status(400).json({ message: error });
    }

    game = new Game({
      name: "Sopa de letras",
      user: userId,
      gameType: gameType,
    });

    await game.save();

    user.games.push(game._id);
    await user.save();

    const newWordSearchGame = new WordSearchGame({
      game: game._id,
      user: userId,
      deck: deck._id,
      grid: grid,
      words: selectedWords,
      status: "inProgress",
      timeTaken: 0,
      foundWords: [],
    });
    await newWordSearchGame.save();

    return res
      .status(201)
      .json({ gameId: game._id, wordSearchGameId: newWordSearchGame._id });
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
    const wordSearchGame = await WordSearchGame.findById(wordSearchGameId);
    if (!wordSearchGame) {
      return res.status(404).json({ error: "Sopa de letras no encontrada" });
    }

    if (req.body.foundWords) wordSearchGame.foundWords = req.body.foundWords;
    const allWordsFound = wordSearchGame.words.every((word) =>
      wordSearchGame.foundWords.includes(word)
    );

    if (!allWordsFound) {
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

    const maxGames = 25;
    if (currentCount >= maxGames) {
      return res.status(200).json({
        message: `¡Felicidades! Has completado ${maxGames} ${gameType}. Puedes comenzar una nueva serie si deseas jugar de nuevo.`,
      });
    }

    user.gamesCompletedByType.set(gameType, currentCount + 1);
    user.totalGamesCompletedByType.set(gameType, totalCount + 1);
    await user.save();

    let gameInProgress = await WordSearchGame.findOne({
      user: userId,
      status: "inProgress",
    });

    if (gameInProgress) {
      return res.status(400).json({
        message: "Ya tienes un Juego de Sopa de Letras en progreso",
        guessTheImageGameId: gameInProgress._id,
      });
    }


    if (currentCount + 1 < maxGames) {
      const deck = await Deck.findById(wordSearchGame.deck).populate("cards");
      if (!deck) {
        return res.status(404).json({ error: "Mazo no encontrado" });
      }

      const words = deck.cards
        .flatMap((card: any) =>
          card.frontSide.text.map((textObj: any) =>
            textObj.content.toUpperCase()
          )
        )
        .filter((text: string) => text.length <= 10);
      if (words.length < 4) {
        return res.status(400).json({
          error:
            "El mazo no tiene suficientes palabras válidas para crear una nueva sopa de letras",
        });
      }

      const selectedWords = getRandomWords(words, 4);
      const { grid, error } = generateWordSearchGrid(selectedWords, 10);

      if (error) {
        return res.status(400).json({ message: error });
      }

      const newWordSearchGame = new WordSearchGame({
        game: wordSearchGame.game,
        user: wordSearchGame.user,
        deck: deck._id,
        grid: grid,
        words: selectedWords,
        status: "inProgress",
        timeTaken: 0,
      });
      await newWordSearchGame.save();
      return res.status(201).json({
        gameId: wordSearchGame.game,
        wordSearchGameId: newWordSearchGame._id,
      });
    } else {
      return res.status(200).json({
        message: `Has alcanzado el límite de ${maxGames} juegos de Sopa de Letras. Puedes reiniciar el contador para comenzar de nuevo.`,
      });
    }
  } catch (error: any) {
    handleValidationErrors(error, res);
  }
};

const handleIncompleteGame = async (
  req: CustomRequest,
  res: Response,
  wordSearchGame: InstanceType<typeof WordSearchGame>
) => {
  if (req.body.forceComplete) {
    await completeGamewordSearchGame(wordSearchGame);
    return res.status(200).json({ message: "Juego completado forzosamente" });
  } else {
    return res.status(400).json({
      error:
        "Todas las palabras deben ser encontradas o el usuario debe elegir terminar el juego antes de completarlo",
    });
  }
};

const completeGamewordSearchGame = async (
  wordSearchGame: InstanceType<typeof WordSearchGame>
) => {
  wordSearchGame.status = "completed";
  await wordSearchGame.save();
};

export const resetGamesCompletedByType = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const { gameType } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    if (!gameType) {
      return res.status(400).json({ error: "El tipo de juego es obligatorio" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    user.gamesCompletedByType.set(gameType, 0);
    await user.save();

    return res.status(200).json({
      message: `El contador de juegos completados se ha reiniciado para juegos de ${gameType}. Puedes comenzar una nueva serie ahora.`,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
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
