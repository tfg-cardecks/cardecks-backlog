import { Response, Request } from "express";

// local imports
import { Game } from "../../models/game";
import { HangmanGame } from "../../models/games/hangmanGame";
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

export const getHangmanGames = async (_req: Request, res: Response) => {
  try {
    const hangmanGames = await HangmanGame.find();
    res.status(200).json(hangmanGames);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const getHangmanGameById = async (req: CustomRequest, res: Response) => {
  try {
    const hangmanGame = await HangmanGame.findById(req.params.id).populate(
      "game"
    );
    if (!hangmanGame) {
      return res
        .status(404)
        .json({ message: "Juego del Ahorcado no encontrado" });
    }
    return res.status(200).json(hangmanGame);
  } catch (error: any) {
    return res.status(500).json({ message: error });
  }
};

export const createHangmanGame = async (req: CustomRequest, res: Response) => {
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

    if (!user.gamesCompletedByType)
      user.gamesCompletedByType = new Map<string, number>();

    const gameType = "HangmanGame";
    const maxGames = settings.totalGames;

    let game = new Game({
      name: "Juego de Ahorcado",
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

    const deck = await Deck.findById(deckId).populate("cards");
    if (!deck) return res.status(404).json({ message: "Mazo no encontrado" });

    const words = deck.cards
      .flatMap((card: any) =>
        card.frontSide.text.map((textObj: any) => cleanWord(textObj.content))
      )
      .filter(
        (text: string, index, self) =>
          text.length <= 10 && self.indexOf(text) === index
      );

    if (words.length < 5)
      return res.status(400).json({
        message:
          "El mazo no tiene suficientes palabras válidas para crear un nuevo Juego del Ahorcado",
      });

    const selectedWords = getRandomWords(words, 5);

    const hangmanGame = new HangmanGame({
      game: game._id,
      user: userId,
      deck: deck._id,
      words: selectedWords,
      currentWordIndex: 0,
      currentWord: selectedWords[0],
      status: "inProgress",
      foundLetters: [],
      wrongLetters: [],
      duration: settings.duration,
      score: 0,
    });

    await hangmanGame.save();

    game.currentGameCount += 1;
    await game.save();
    return res.status(201).json({
      message: "Juego creado con éxito",
      game,
      hangmanGame,
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

export const guessLetter = async (req: CustomRequest, res: Response) => {
  try {
    const { hangmanGameId } = req.params;
    const { letter } = req.body;

    const hangmanGame = await HangmanGame.findById(hangmanGameId);
    if (!hangmanGame)
      return res
        .status(404)
        .json({ message: "Juego del Ahorcado no encontrado" });

    if (hangmanGame.status === "completed")
      return res
        .status(400)
        .json({ message: "El juego ya ha sido completado" });

    if (
      hangmanGame.foundLetters.includes(letter) ||
      hangmanGame.wrongLetters.includes(letter)
    ) {
      return res
        .status(400)
        .json({ message: "La letra ya fue adivinada anteriormente" });
    }

    const currentWord = hangmanGame.words[hangmanGame.currentWordIndex];
    if (currentWord.includes(letter)) {
      hangmanGame.foundLetters.push(letter);

      if (
        currentWord
          .split("")
          .every((char) => hangmanGame.foundLetters.includes(char))
      ) {
        hangmanGame.currentWordIndex += 1;
        hangmanGame.foundLetters = [];
        hangmanGame.currentWord =
          hangmanGame.words[hangmanGame.currentWordIndex] || "";
        if (hangmanGame.currentWordIndex >= hangmanGame.words.length) {
          hangmanGame.status = "completed";
        }
      }
    } else {
      hangmanGame.wrongLetters.push(letter);
    }

    await hangmanGame.save();
    return res.status(200).json(hangmanGame);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const completeCurrentGame = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { hangmanGameId } = req.params;
    const {
      countAsCompleted = true,
      forceComplete = false,
      guessedLetters,
      wrongLetters,
    } = req.body;
    const userId = req.user?.id;
    const hangmanGame = await HangmanGame.findById(hangmanGameId).populate(
      "game"
    );
    if (!hangmanGame)
      return res.status(404).json({ error: "Juego de Ahorcado no encontrado" });

    const game = await Game.findById(hangmanGame.game);
    if (!game) {
      return res.status(404).json({ message: "Juego no encontrado" });
    }

    hangmanGame.foundLetters = guessedLetters;
    hangmanGame.wrongLetters = wrongLetters;

    const currentWord = hangmanGame.words[hangmanGame.currentWordIndex];

    const uniqueLetters = new Set(currentWord.split(""));
    const allLettersFound = Array.from(uniqueLetters).every((letter) =>
      hangmanGame.foundLetters.includes(letter)
    );

    if (!allLettersFound && forceComplete) {
      return handleIncompleteGame(req, res, hangmanGame);
    }

    if (countAsCompleted) {
      hangmanGame.status = "completed";
      await hangmanGame.save();

      const user = await User.findById(userId);
      if (!user)
        return res.status(404).json({ error: "Usuario no encontrado" });
      if (!user.gamesCompletedByType)
        user.gamesCompletedByType = new Map<string, number>();
      if (!user.totalGamesCompletedByType)
        user.totalGamesCompletedByType = new Map<string, number>();

      const gameType = "HangmanGame";
      const currentCount = user.gamesCompletedByType.get(gameType) || 0;
      const totalCount = user.totalGamesCompletedByType.get(gameType) || 0;

      const maxGames = game.totalGames;

      user.gamesCompletedByType.set(gameType, currentCount + 1);
      user.totalGamesCompletedByType.set(gameType, totalCount + 1);
      await user.save();

      game.currentGameCount += 1;

      if (game.currentGameCount > maxGames) {
        game.completed = true;
        await game.save();
        await completeAllHangmanGames(game._id.toString());
        return res.status(200).json({
          message: `¡Felicidades! Has completado las ${maxGames} partidas de ${gameType}.`,
          currentGame: game.currentGameCount,
          totalGames: maxGames,
        });
      }
      await game.save();
    }

    const deck = await Deck.findById(hangmanGame.deck).populate("cards");
    if (!deck) return res.status(404).json({ error: "Mazo no encontrado" });

    const words = deck.cards
      .flatMap((card: any) =>
        card.frontSide.text.map((textObj: any) => cleanWord(textObj.content))
      )
      .filter(
        (text: string, index, self) =>
          text.length <= 10 && self.indexOf(text) === index
      );

    if (words.length < 5)
      return res.status(400).json({
        error:
          "El mazo no tiene suficientes palabras válidas para crear un nuevo Juego del Ahorcado",
      });

    const selectedWords = getRandomWords(words, 5);

    const newHangmanGame = new HangmanGame({
      game: hangmanGame.game,
      user: hangmanGame.user,
      deck: deck._id,
      words: selectedWords,
      currentWordIndex: 0,
      currentWord: selectedWords[0],
      status: "inProgress",
      foundLetters: [],
      wrongLetters: [],
      duration: hangmanGame.duration,
      score: 0,
    });
    await newHangmanGame.save();
    return res.status(201).json({
      gameId: hangmanGame.game,
      hangmanGameId: newHangmanGame._id,
      currentGame: game.currentGameCount,
      totalGames: game.totalGames,
    });
  } catch (error: any) {
    handleValidationErrors(error, res);
  }
};

const handleIncompleteGame = async (
  req: CustomRequest,
  res: Response,
  hangmanGame: InstanceType<typeof HangmanGame>
) => {
  const game = await Game.findById(hangmanGame.game);
  if (!game) {
    return res.status(404).json({ message: "Juego no encontrado" });
  }
  if (req.body.forceComplete) {
    await completeHangmanGame(hangmanGame);
    await completeAllHangmanGames(game._id.toString());
    return res.status(200).json({
      message: "Juego completado forzosamente",
      nextGame: true,
      reason: "forceComplete",
    });
  } else {
    if (game.currentGameCount >= game.totalGames) {
      await completeHangmanGame(hangmanGame);
      await completeAllHangmanGames(game._id.toString());
      return res.status(200).json({
        message: "Juego completado forzosamente",
        reason: "maxGamesReached",
      });
    } else {
      return res.status(200).json({
        message: "Juego incompleto",
        nextGame: true,
        hangmanGameId: hangmanGame._id,
      });
    }
  }
};

const completeHangmanGame = async (
  hangmanGame: InstanceType<typeof HangmanGame>
) => {
  hangmanGame.status = "completed";
  await hangmanGame.save();
};

const completeAllHangmanGames = async (gameId: string) => {
  await HangmanGame.updateMany(
    { game: gameId, status: { $ne: "completed" } },
    { status: "completed" }
  );
};

export const deleteHangmanGame = async (req: CustomRequest, res: Response) => {
  try {
    const { hangmanGameId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    if (!hangmanGameId) {
      return res
        .status(400)
        .json({ error: "El ID del Juego del Ahorcado es obligatorio" });
    }

    const hangmanGame = await HangmanGame.findByIdAndDelete(hangmanGameId);
    if (!hangmanGame) {
      return res
        .status(404)
        .json({ error: "Juego del Ahorcado no encontrado" });
    }

    await Game.findByIdAndDelete(hangmanGame.game);

    if (hangmanGame.status === "completed") {
      const user = await User.findById(userId);
      if (user) {
        const gameType = "HangmanGame";
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
