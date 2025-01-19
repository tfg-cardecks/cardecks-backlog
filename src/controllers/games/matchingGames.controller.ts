import { Response, Request } from "express";

// local imports
import { Game } from "../../models/game";
import { MatchingGame } from "../../models/games/matchingGame";
import { User } from "../../models/user";
import { Deck } from "../../models/deck";
import { handleValidationErrors } from "../../validators/validate";
import { CustomRequest } from "../../interfaces/customRequest";
import { Card } from "../../models/card";

function cleanWord(word: string): string {
  const withoutSpecialChars = word.replace(/[^A-Z0-9\s]/gi, "");
  return withoutSpecialChars.toUpperCase();
}

export const getMatchingGames = async (_req: Request, res: Response) => {
  try {
    const matchingGames = await MatchingGame.find();
    res.status(200).json(matchingGames);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const getMatchingGameById = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const matchingGame = await MatchingGame.findById(req.params.id).populate(
      "game"
    );
    if (!matchingGame) {
      return res
        .status(404)
        .json({ message: "Juego de Relacionar no encontrado" });
    }
    return res.status(200).json(matchingGame);
  } catch (error: any) {
    return res.status(500).json({ message: error });
  }
};

export const createMatchingGame = async (req: CustomRequest, res: Response) => {
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

    const gameType = "MatchingGame";
    const maxGames = settings?.totalGames || 1;

    const game = new Game({
      name: "Juego de Relacionar",
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

    const textTextCards = deck.cards.filter(
      (card: any) => card.cardType === "txtTxt"
    );
    if (textTextCards.length < 10) {
      return res.status(400).json({
        message:
          "El mazo debe tener al menos 10 cartas de tipo txtTxt para crear un Juego de Relacionar",
      });
    }

    const frontTexts = new Set<string>();
    const backTexts = new Set<string>();

    for (const cardId of textTextCards) {
      const card = (await Card.findById(cardId)) as any;
      for (const textObj of card.frontSide.text) {
        const word = cleanWord(textObj.content);
        if (frontTexts.has(word)) {
          return res.status(400).json({
            message:
              "No puedes usar cartas con el mismo texto en la parte delantera",
          });
        }
        frontTexts.add(word);
      }
      for (const textObj of card.backSide.text) {
        const meaning = cleanWord(textObj.content);
        if (backTexts.has(meaning)) {
          return res.status(400).json({
            message:
              "No puedes usar cartas con el mismo texto en la parte trasera",
          });
        }
        backTexts.add(meaning);
      }
    }

    const wordMeaningMap = new Map<string, string>();

    textTextCards.forEach((card: any) => {
      card.frontSide.text.forEach((textObj: any, index: number) => {
        const word = cleanWord(textObj.content);
        const meaning = cleanWord(card.backSide.text[index].content);
        if (word.length <= 9) {
          wordMeaningMap.set(word, meaning);
        }
      });
    });

    const words = Array.from(wordMeaningMap.keys());
    const meanings = Array.from(wordMeaningMap.values());

    if (words.length < 10 || meanings.length < 10)
      return res.status(400).json({
        message:
          "El mazo no tiene suficientes cartas con imágenes y palabras válidas para crear un nuevo Juego de Adivinar la Imagen",
      });

    const selectedWords = getRandomWords(words, settings?.maxWords || 2);
    const selectedMeanings = selectedWords.map((word) =>
      wordMeaningMap.get(word)
    );

    const remainingMeanings = meanings.filter(
      (meaning) => !selectedMeanings.includes(meaning)
    );

    const additionalMeanings = getRandomWords(
      remainingMeanings,
      selectedWords.length * 2 - selectedMeanings.length
    );

    const options = shuffleArray([...selectedMeanings, ...additionalMeanings]);

    const correctAnswer = new Map();
    selectedWords.forEach((word, index) => {
      correctAnswer.set(word, selectedMeanings[index]);
    });

    const matchingGame = new MatchingGame({
      game: game._id,
      user: userId,
      deck: deckId,
      words: selectedWords,
      options: options,
      correctAnswer: correctAnswer,
      duration: settings?.duration || 60,
      maxWords: settings?.maxWords || 2,
      status: "inProgress",
    });

    await matchingGame.save();

    game.currentGameCount += 1;
    await game.save();

    return res.status(201).json({
      message: "Juego creado con éxito",
      game,
      matchingGame,
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

function shuffleArray(array: any[]): any[] {
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
    const { matchingGameId } = req.params;
    const userId = req.user?.id;
    const {
      countAsCompleted = true,
      forceComplete = false,
      selectedAnswer,
    } = req.body;

    const matchingGame = await MatchingGame.findById(matchingGameId).populate(
      "game"
    );

    if (!matchingGame) {
      return res
        .status(404)
        .json({ error: "Juego de relacionar no encontrado" });
    }
    matchingGame.selectedAnswer = new Map(Object.entries(selectedAnswer));
    const isAnswerCorrect = Array.from(
      matchingGame.correctAnswer.entries()
    ).every(([key, value]) => matchingGame.selectedAnswer.get(key) === value);

    if (!isAnswerCorrect && forceComplete) {
      await matchingGame.save();
      return handleIncompleteGame(req, res, matchingGame);
    }
    if (isAnswerCorrect || countAsCompleted) {
      matchingGame.status = "completed";
      await matchingGame.save();

      const user = await User.findById(userId);
      if (!user)
        return res.status(404).json({ error: "Usuario no encontrado" });
      if (!user.gamesCompletedByType)
        user.gamesCompletedByType = new Map<string, number>();
      if (!user.totalGamesCompletedByType)
        user.totalGamesCompletedByType = new Map<string, number>();

      const gameType = "MatchingGame";
      const currentCount = user.gamesCompletedByType.get(gameType) || 0;
      const totalCount = user.totalGamesCompletedByType.get(gameType) || 0;

      const game = await Game.findById(matchingGame.game);
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

      const deck = await Deck.findById(matchingGame.deck).populate("cards");
      if (!deck) return res.status(404).json({ error: "Mazo no encontrado" });

      const textTextCards = deck.cards.filter(
        (card: any) => card.cardType === "txtTxt"
      );

      if (textTextCards.length < 10) {
        return res.status(400).json({
          message:
            "El mazo debe tener al menos 10 cartas de tipo txtTxt para crear un Juego de Relacionar",
        });
      }

      const frontTexts = new Set<string>();
      const backTexts = new Set<string>();

      for (const cardId of textTextCards) {
        const card = (await Card.findById(cardId)) as any;
        for (const textObj of card.frontSide.text) {
          const word = cleanWord(textObj.content);
          if (frontTexts.has(word)) {
            return res.status(400).json({
              message:
                "No puedes usar cartas con el mismo texto en la parte delantera",
            });
          }
          frontTexts.add(word);
        }
        for (const textObj of card.backSide.text) {
          const meaning = cleanWord(textObj.content);
          if (backTexts.has(meaning)) {
            return res.status(400).json({
              message:
                "No puedes usar cartas con el mismo texto en la parte trasera",
            });
          }
          backTexts.add(meaning);
        }
      }

      const wordMeaningMap = new Map<string, string>();
      textTextCards.forEach((card: any) => {
        card.frontSide.text.forEach((textObj: any, index: number) => {
          const word = cleanWord(textObj.content);
          const meaning = cleanWord(card.backSide.text[index].content);
          if (word.length <= 9) {
            wordMeaningMap.set(word, meaning);
          }
        });
      });

      const words = Array.from(wordMeaningMap.keys());
      const meanings = Array.from(wordMeaningMap.values());

      if (words.length < 10 || meanings.length < 10)
        return res.status(400).json({
          message:
            "El mazo no tiene suficientes cartas con palabras válidas para crear un nuevo Juego de Relacionar",
        });

      const selectedWords = getRandomWords(words, matchingGame.maxWords);
      const selectedMeanings = selectedWords.map((word) =>
        wordMeaningMap.get(word)
      );

      const remainingMeanings = meanings.filter(
        (meaning) => !selectedMeanings.includes(meaning)
      );

      const additionalMeanings = getRandomWords(
        remainingMeanings,
        selectedWords.length * 2 - selectedMeanings.length
      );

      const options = shuffleArray([
        ...selectedMeanings,
        ...additionalMeanings,
      ]);

      const correctAnswer = new Map();
      selectedWords.forEach((word, index) => {
        correctAnswer.set(word, selectedMeanings[index]);
      });

      const newMatchingGame = new MatchingGame({
        game: game._id,
        user: userId,
        deck: deck._id,
        words: selectedWords,
        options: options,
        correctAnswer: correctAnswer,
        duration: matchingGame.duration,
        maxWords: matchingGame.maxWords,
        status: "inProgress",
      });

      await newMatchingGame.save();
      return res.status(201).json({
        gameId: matchingGame.game,
        matchingGameId: newMatchingGame._id,
        currentGame: game.currentGameCount,
        totalGames: maxGames,
      });
    } else {
      await matchingGame.save();
      return res.status(200).json({
        message: "Respuesta incorrecta, intenta de nuevo.",
      });
    }
  } catch (error: any) {
    handleValidationErrors(error, res);
  }
};

const handleIncompleteGame = async (
  req: CustomRequest,
  res: Response,
  matchingGame: InstanceType<typeof MatchingGame>
) => {
  const game = await Game.findById(matchingGame.game);
  if (!game) {
    return res.status(404).json({ message: "Juego no encontrado" });
  }
  if (req.body.forceComplete) {
    await completeGamematchingGame(matchingGame);
    return res.status(200).json({
      message: "Juego completado forzosamente",
      nextGame: true,
      reason: "forceComplete",
    });
  } else {
    if (game.currentGameCount >= game.totalGames) {
      await completeGamematchingGame(matchingGame);
      return res.status(200).json({
        message: "Juego completado forzosamente",
        reason: "maxGamesReached",
      });
    } else {
      return res.status(200).json({
        message: "Juego incompleto",
        nextGame: true,
        matchingGameId: matchingGame._id,
      });
    }
  }
};

const completeGamematchingGame = async (
  matchingGame: InstanceType<typeof MatchingGame>
) => {
  matchingGame.status = "completed";
  await matchingGame.save();
};

export const deleteMatchingGame = async (req: CustomRequest, res: Response) => {
  try {
    const { matchingGameId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    if (!matchingGameId) {
      return res
        .status(400)
        .json({ error: "El ID del juego de relacionar es obligatorio" });
    }

    const matchingGame = await MatchingGame.findByIdAndDelete(matchingGameId);
    if (!matchingGame) {
      return res
        .status(404)
        .json({ error: "Juedo de Relacionar no encontrado" });
    }

    await Game.findByIdAndDelete(matchingGame.game);

    if (matchingGame.status === "completed") {
      const user = await User.findById(userId);
      if (user) {
        const gameType = "MatchingGame";
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
