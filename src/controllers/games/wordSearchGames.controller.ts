import { Response, Request } from "express";

//local imports
import { Game } from "../../models/game";
import { WordSearchGame } from "../../models/games/wordSearchGame";
import { User } from "../../models/user";
import { handleValidationErrors } from "../../validators/validate";
import { CustomRequest } from "../../interfaces/customRequest";
import { generateWordSearchGrid } from "../../utils/wordSearchGenerator";
import { wordLists, Theme } from "../../utils/wordLists";

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
      return res.status(404).json({ message: "WordSearchGame not found" });
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
    const theme: Theme = req.body.theme;
    const userId = req.user?.id;

    if (!theme || !wordLists[theme])
      return res.status(400).json({ message: "Invalid theme" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.gamesCompletedByType)
      user.gamesCompletedByType = new Map<string, number>();

    const gameType = "WordSearchGame";
    const currentCount = user.gamesCompletedByType.get(gameType) || 0;

    if (currentCount >= 100) {
      return res.status(400).json({
        message: `You have already completed 100 ${gameType}. Please reset the counter to start a new series.`,
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

    if (game)
      return res
        .status(400)
        .json({ message: "You already have an in Progress WordSearchGame" });

    game = new Game({
      name: "Sopa de letras",
      user: userId,
      gameType: gameType,
    });

    await game.save();

    const words = wordLists[theme];

    const shuffledWords = words.sort(() => 0.5 - Math.random());
    const selectedWords = shuffledWords.slice(0, 5);
    const grid = generateWordSearchGrid(selectedWords, 10);

    const newWordSearchGame = new WordSearchGame({
      game: game._id,
      user: userId,
      grid: grid,
      words: selectedWords,
      theme: theme,
      status: "inProgress",
      timeTaken: 0,
      completed: false,
    });
    await newWordSearchGame.save();

    return res
      .status(201)
      .json({ gameId: game._id, wordSearchGameId: newWordSearchGame._id });
  } catch (error: any) {
    handleValidationErrors(error, res);
  }
};

export const completeCurrentGame = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { wordSearchGameId } = req.params;
    const userId = req.user?.id;
    const wordSearchGame = await WordSearchGame.findById(wordSearchGameId);
    if (!wordSearchGame)
      return res.status(404).json({ error: "WordSearchGame not found" });

    if (req.body.foundWords) wordSearchGame.foundWords = req.body.foundWords;
    const allWordsFound = wordSearchGame.words.every((word) =>
      wordSearchGame.foundWords.includes(word)
    );

    if (!allWordsFound) return handleIncompleteGame(req, res, wordSearchGame);
    wordSearchGame.status = "completed";
    wordSearchGame.completed = true;
    await wordSearchGame.save();

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (!user.gamesCompletedByType)
      user.gamesCompletedByType = new Map<string, number>();

    const gameType = "WordSearchGame";
    const currentCount = user.gamesCompletedByType.get(gameType) || 0;

    if (currentCount >= 100)
      return res.status(200).json({
        message: `Congratulations! You've completed 100 ${gameType}. You can start a new series if you want to play again.`,
      });
    user.gamesCompletedByType.set(gameType, currentCount + 1);
    await user.save();

    if (currentCount + 1 < 100) {
      const theme: Theme = wordSearchGame.theme;
      const words = wordLists[theme];
      const shuffledWords = words.sort(() => 0.5 - Math.random());
      const selectedWords = shuffledWords.slice(0, 5);
      const grid = generateWordSearchGrid(selectedWords, 10);

      const newWordSearchGame = new WordSearchGame({
        game: wordSearchGame.game,
        user: wordSearchGame.user,
        grid: grid,
        words: selectedWords,
        theme: theme,
        status: "inProgress",
        timeTaken: 0,
        completed: false,
      });
      await newWordSearchGame.save();
      return res.status(201).json({
        gameId: wordSearchGame.game,
        wordSearchGameId: newWordSearchGame._id,
      });
    } else {
      return res.status(200).json({
        message: `You've reached the limit of 100 ${gameType}. You can reset the counter to start over.`,
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
    return res.status(200).json({ message: "Game forcibly completed" });
  } else {
    return res.status(400).json({
      error:
        "All words must be found or user must choose to finish the game before completing",
    });
  }
};

const completeGamewordSearchGame = async (
  wordSearchGame: InstanceType<typeof WordSearchGame>
) => {
  wordSearchGame.status = "completed";
  wordSearchGame.completed = true;
  await wordSearchGame.save();
};

export const resetGamesCompletedByType = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const { gameType } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!gameType)
      return res.status(400).json({ error: "Game type is required" });

    user.gamesCompletedByType.set(gameType, 0);
    await user.save();

    return res.status(200).json({
      message: `Games completed count reset for ${gameType}. You can start a new series now.`,
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

    const wordSearchGame = await WordSearchGame.findByIdAndDelete(
      wordSearchGameId
    );
    if (!wordSearchGame)
      return res.status(404).json({ error: "WordSearchGame not found" });

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
