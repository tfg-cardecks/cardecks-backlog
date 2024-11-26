import { Response, Request } from "express";

//local imports
import { Game } from "../../models/game";
import { HangmanGame } from "../../models/games/hangmanGame";
import { User } from "../../models/user";
import { Deck } from "../../models/deck";
import { handleValidationErrors } from "../../validators/validate";
import { CustomRequest } from "../../interfaces/customRequest";

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
    const hangmanGame = await HangmanGame.findById(req.params.id);
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

    const gameType = "HangmanGame";
    const currentCount = user.gamesCompletedByType.get(gameType) || 0;

    const maxGames = 25;

    if (currentCount >= maxGames) {
      return res.status(400).json({
        message: `Ya has completado ${maxGames} juegos de Ahorcado. Por favor, reinicia el contador para comenzar una nueva serie.`,
      });
    }

    let game = await Game.findOne({
      user: userId,
      gameType: gameType,
      _id: {
        $in: await HangmanGame.find({
          user: userId,
          status: "inProgress",
        }).distinct("game"),
      },
    });

    if (game) {
      const hangmanGame = await HangmanGame.findOne({
        game: game._id,
        user: userId,
        status: "inProgress",
      });

      return res.status(200).json({
        message: "Ya tienes un Juego del Ahorcado en progreso",
        hangmanGameId: hangmanGame?._id,
      });
    }

    const deck = await Deck.findById(deckId).populate("cards");
    if (!deck) return res.status(404).json({ message: "Mazo no encontrado" });

    const words = deck.cards
      .flatMap((card: any) =>
        card.frontSide.text.map((textObj: any) => textObj.content.toUpperCase())
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

    const selectedWords = [];
    while (selectedWords.length < 5) {
      const randomIndex = Math.floor(Math.random() * words.length);
      selectedWords.push(words[randomIndex]);
    }

    game = new Game({
      name: "Juego de Ahorcado",
      user: userId,
      gameType: "HangmanGame",
    });

    await game.save();

    user.games.push(game._id);
    await user.save();

    const newHangmanGame = new HangmanGame({
      game: game._id,
      user: userId,
      deck: deck._id,
      words: selectedWords,
      currentWordIndex: 0,
      status: "inProgress",
      foundLetters: [],
      wrongLetters: [],
      timeTaken: 0,
    });

    await newHangmanGame.save();

    return res
      .status(201)
      .json({ gameId: game._id, hangmanGameId: newHangmanGame._id });
  } catch (error: any) {
    handleValidationErrors(error, res);
  }
};

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
      timeTaken,
      guessedLetters,
      wrongLetters,
    } = req.body;
    const userId = req.user?.id;
    const hangmanGame = await HangmanGame.findById(hangmanGameId);
    if (!hangmanGame)
      return res.status(404).json({ error: "Juego de Ahorcado no encontrado" });

    if (forceComplete) {
      hangmanGame.timeTaken = timeTaken;
      hangmanGame.status = "completed";
      await hangmanGame.save();
      return res.status(200).json({ message: "Juego completado forzosamente" });
    }

    hangmanGame.foundLetters = guessedLetters;
    hangmanGame.wrongLetters = wrongLetters;

    const currentWord = hangmanGame.words[hangmanGame.currentWordIndex];

    const uniqueLetters = new Set(currentWord.split(""));
    const allLettersFound = Array.from(uniqueLetters).every((letter) =>
      hangmanGame.foundLetters.includes(letter)
    );

    if (!allLettersFound && countAsCompleted) {
      return handleIncompleteGame(req, res, hangmanGame);
    }

    if (countAsCompleted) {
      hangmanGame.status = "completed";
      hangmanGame.timeTaken = timeTaken;
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

      const maxGames = 25;
      if (currentCount >= maxGames)
        return res.status(200).json({
          message: `¡Felicidades! Has completado ${maxGames} ${gameType}. Puedes comenzar una nueva serie si deseas jugar de nuevo.`,
        });

      user.gamesCompletedByType.set(gameType, currentCount + 1);
      user.totalGamesCompletedByType.set(gameType, totalCount + 1);
      await user.save();
    }

    let gameInProgress = await HangmanGame.findOne({
      user: userId,
      status: "inProgress",
    });

    if (gameInProgress) {
      return res.status(400).json({
        message: "Ya tienes un Juego del Ahorcado en progreso",
        guessTheImageGameId: gameInProgress._id,
      });
    }

    const deck = await Deck.findById(hangmanGame.deck).populate("cards");
    if (!deck) return res.status(404).json({ error: "Mazo no encontrado" });

    const words = deck.cards
      .flatMap((card: any) =>
        card.frontSide.text.map((textObj: any) => textObj.content.toUpperCase())
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

    const selectedWords = [];
    while (selectedWords.length < 5) {
      const randomIndex = Math.floor(Math.random() * words.length);
      selectedWords.push(words[randomIndex]);
    }

    const newHangmanGame = new HangmanGame({
      game: hangmanGame.game,
      user: hangmanGame.user,
      deck: deck._id,
      words: selectedWords,
      currentWordIndex: 0,
      status: "inProgress",
      foundLetters: [],
      wrongLetters: [],
      timeTaken: 0,
    });
    await newHangmanGame.save();
    return res.status(201).json({
      gameId: hangmanGame.game,
      hangmanGameId: newHangmanGame._id,
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
  if (req.body.forceComplete) {
    await completeHangmanGame(hangmanGame);
    return res.status(200).json({ message: "Juego completado forzosamente" });
  } else {
    return res.status(400).json({
      error:
        "Todas las letras deben ser encontradas o el usuario debe elegir terminar el juego antes de completarlo",
    });
  }
};

const completeHangmanGame = async (
  hangmanGame: InstanceType<typeof HangmanGame>
) => {
  hangmanGame.completed = true;
  hangmanGame.status = "completed";
  await hangmanGame.save();
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

    if (hangmanGame.completed) {
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
