import { Response, Request } from "express";

// local imports
import { Game } from "../../models/game";
import { GuessTheImageGame } from "../../models/games/guessTheImageGame";
import { User } from "../../models/user";
import { Deck } from "../../models/deck";
import { handleValidationErrors } from "../../validators/validate";
import { CustomRequest } from "../../interfaces/customRequest";

function cleanWord(word: string): string {
  const withoutSpecialChars = word.replace(/[?!\d]/g, "");
  return withoutSpecialChars.trim().toUpperCase();
}

export const getGuessTheImageGames = async (_req: Request, res: Response) => {
  try {
    const guessTheImageGames = await GuessTheImageGame.find();
    res.status(200).json(guessTheImageGames);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const getGuessTheImageGameById = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const guessTheImageGame = await GuessTheImageGame.findById(
      req.params.id
    ).populate("game");
    if (!guessTheImageGame) {
      return res
        .status(404)
        .json({ message: "Juego de Adivinar la Imagen no encontrado" });
    }
    return res.status(200).json(guessTheImageGame);
  } catch (error: any) {
    return res.status(500).json({ message: error });
  }
};

export const createGuessTheImageGame = async (
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

    const textImgCards = deck.cards.filter(
      (card: any) => card.cardType === "txtImg"
    );
    if (textImgCards.length < 5) {
      return res.status(400).json({
        message:
          "El mazo debe tener al menos 5 cartas de tipo txtImg para crear un Juego de Adivinar la Imagen",
      });
    }
    const images = textImgCards
      .flatMap((card: any) =>
        card.backSide.images.map((imageObj: any) => imageObj.url)
      )
      .filter((image: string) => image);

    const words = textImgCards
      .flatMap((card: any) =>
        card.frontSide.text.map((textObj: any) => cleanWord(textObj.content))
      )
      .filter(
        (text: string, index, self) =>
          text.length > 0 && self.indexOf(text) === index
      );

    if (images.length < 5 || words.length < 5)
      return res.status(400).json({
        message:
          "El mazo no tiene suficientes cartas con imágenes y palabras válidas para crear un nuevo Juego de Adivinar la Imagen",
      });

    const gameType = "GuessTheImageGame";
    const maxGames = settings?.totalGames || 1;

    const game = new Game({
      name: "Adivinar la Imagen",
      description:
        "Un juego interactivo donde debes adivinar la imagen correcta.",
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

    const randomIndex = Math.floor(Math.random() * images.length);
    const image = images[randomIndex];
    const correctAnswer = words[randomIndex];

    const wordOptions = [correctAnswer];
    while (wordOptions.length < 4) {
      const randomWordIndex = Math.floor(Math.random() * words.length);
      const randomWord = words[randomWordIndex];
      if (!wordOptions.includes(randomWord)) {
        wordOptions.push(randomWord);
      }
    }

    const options = shuffleArray(wordOptions);

    const guessTheImageGame = new GuessTheImageGame({
      game: game._id,
      user: userId,
      deck: deck._id,
      image: image,
      options: options,
      correctAnswer: correctAnswer,
      selectedAnswer: "",
      status: "inProgress",
      duration: settings?.duration || 60,
    });

    await guessTheImageGame.save();

    game.currentGameCount += 1;
    await game.save();
    return res.status(201).json({
      message: "Juego creado con éxito",
      game,
      guessTheImageGame,
      currentGame: game.currentGameCount,
      totalGames: maxGames,
    });
  } catch (error: any) {
    handleValidationErrors(error, res);
  }
};

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
    const { guessTheImageGameId } = req.params;
    const userId = req.user?.id;
    const {
      countAsCompleted = true,
      forceComplete = false,
      selectedAnswer,
    } = req.body;

    const guessTheImageGame = await GuessTheImageGame.findById(
      guessTheImageGameId
    ).populate("game");
    if (!guessTheImageGame)
      return res
        .status(404)
        .json({ error: "Juego de Adivinar la Imagen no encontrado" });

    guessTheImageGame.selectedAnswer = selectedAnswer;

    const isAnswerCorrect =
      guessTheImageGame.correctAnswer === guessTheImageGame.selectedAnswer;
    if (!isAnswerCorrect && forceComplete) {
      return handleIncompleteGame(req, res, guessTheImageGame);
    }

    if (countAsCompleted) {
      guessTheImageGame.status = "completed";
      await guessTheImageGame.save();

      const user = await User.findById(userId);
      if (!user)
        return res.status(404).json({ error: "Usuario no encontrado" });
      if (!user.gamesCompletedByType)
        user.gamesCompletedByType = new Map<string, number>();
      if (!user.totalGamesCompletedByType)
        user.totalGamesCompletedByType = new Map<string, number>();

      const gameType = "GuessTheImageGame";
      const currentCount = user.gamesCompletedByType.get(gameType) || 0;
      const totalCount = user.totalGamesCompletedByType.get(gameType) || 0;

      const game = await Game.findById(guessTheImageGame.game);
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

      const deck = await Deck.findById(guessTheImageGame.deck).populate(
        "cards"
      );
      if (!deck) return res.status(404).json({ error: "Mazo no encontrado" });
      const textImgCards = deck.cards.filter(
        (card: any) => card.cardType === "txtImg"
      );

      if (textImgCards.length < 5) {
        return res.status(400).json({
          message:
            "El mazo debe tener al menos 5 cartas de tipo txtImg para crear un Juego de Adivinar la Imagen",
        });
      }

      const images = textImgCards
        .flatMap((card: any) =>
          card.backSide.images.map((imageObj: any) => imageObj.url)
        )
        .filter((image: string) => image);

      const words = textImgCards
        .flatMap((card: any) =>
          card.frontSide.text.map((textObj: any) => cleanWord(textObj.content))
        )
        .filter(
          (text: string, index, self) =>
            text.length <= 10 && self.indexOf(text) === index
        );

      if (images.length < 5 || words.length < 5)
        return res.status(400).json({
          message:
            "El mazo no tiene suficientes cartas con imágenes y palabras válidas para crear un nuevo Juego de Adivinar la Imagen",
        });

      const randomIndex = Math.floor(Math.random() * images.length);
      const image = images[randomIndex];
      const correctAnswer = words[randomIndex];

      const wordOptions = [correctAnswer];
      while (wordOptions.length < 4) {
        const randomWordIndex = Math.floor(Math.random() * words.length);
        const randomWord = words[randomWordIndex];
        if (!wordOptions.includes(randomWord)) {
          wordOptions.push(randomWord);
        }
      }

      const options = shuffleArray(wordOptions);

      const newGuessTheImageGame = new GuessTheImageGame({
        game: guessTheImageGame.game,
        user: guessTheImageGame.user,
        deck: deck._id,
        image: image,
        options: options,
        correctAnswer: correctAnswer,
        selectedAnswer: "",
        status: "inProgress",
        duration: guessTheImageGame.duration,
      });

      await newGuessTheImageGame.save();
      return res.status(201).json({
        gameId: guessTheImageGame.game,
        guessTheImageGameId: newGuessTheImageGame._id,
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
  guessTheImageGame: InstanceType<typeof GuessTheImageGame>
) => {
  const game = await Game.findById(guessTheImageGame.game);
  if (!game) {
    return res.status(404).json({ message: "Juego no encontrado" });
  }
  if (req.body.forceComplete) {
    await completeGuessTheImageGame(guessTheImageGame);
    return res.status(200).json({
      message: "Juego completado forzosamente",
      nextGame: true,
      reason: "forceComplete",
    });
  } else {
    if (game.currentGameCount >= game.totalGames) {
      await completeGuessTheImageGame(guessTheImageGame);
      return res.status(200).json({
        message: "Juego completado forzosamente",
        reason: "maxGamesReached",
      });
    } else {
      return res.status(200).json({
        message: "Juego incompleto",
        nextGame: true,
        guessTheImageGameId: guessTheImageGame._id,
      });
    }
  }
};

const completeGuessTheImageGame = async (
  guessTheImageGame: InstanceType<typeof GuessTheImageGame>
) => {
  guessTheImageGame.status = "completed";
  await guessTheImageGame.save();
};

export const deleteGuessTheImageGame = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { guessTheImageGameId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    if (!guessTheImageGameId) {
      return res.status(400).json({
        error: "El ID del Juego de Adivinar la Imagen es obligatorio",
      });
    }

    const guessTheImageGame = await GuessTheImageGame.findByIdAndDelete(
      guessTheImageGameId
    );
    if (!guessTheImageGame) {
      return res
        .status(404)
        .json({ error: "Juego de Adivinar la Imagen no encontrado" });
    }

    await Game.findByIdAndDelete(guessTheImageGame.game);

    if (guessTheImageGame.status == "completed") {
      const user = await User.findById(userId);
      if (user) {
        const gameType = "GuessTheImageGame";
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
