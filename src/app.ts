import express, { Express, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import expressOasGenerator from "express-oas-generator";
import path from "path";

//local imports
import authRoutes from "./routes/auth.routes";
import cardRoutes from "./routes/card.routes";
import deckRoutes from "./routes/deck.routes";
import gameRoutes from "./routes/game.routes";
import wordSearchGameRoutes from "./routes/games/wordSearchGame.routes";
import userRoutes from "./routes/user.routes";
import hangmanGameRoutes from "./routes/games/hangmanGame.routes";
import guessTheImageGameRoutes from "./routes/games/guessTheImageGame.routes";
import matchingGameRoutes from "./routes/games/matchingGame.routes";
import letterOrderGame from "./routes/games/letterOrderGame.routes";

const app: Express = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api", cardRoutes);
app.use("/api", deckRoutes);
app.use("/api", gameRoutes);
app.use("/api", wordSearchGameRoutes);
app.use("/api", userRoutes);
app.use("/api", hangmanGameRoutes);
app.use("/api", guessTheImageGameRoutes);
app.use("/api", matchingGameRoutes);
app.use("/api", letterOrderGame);

app.get("/", (_req: Request, res: Response) => {
  res.redirect("/api-docs/");
});

app.use("/images", express.static(path.join(__dirname, "images")));

expressOasGenerator.handleResponses(app, {
  mongooseModels: [
    "User",
    "Card",
    "Deck",
    "Game",
    "WordSearchGame",
    "HangmanGame",
    "GuessTheImageGame",
    "MatchingGame",
    "LetterOrderGame",
  ],
  swaggerDocumentOptions: { info: { title: "Cardecks API", version: "1.0.0" } },
  specOutputFileBehavior: "PRESERVE",
});

expressOasGenerator.handleRequests();

export default app;
