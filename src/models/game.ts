import mongoose from "mongoose";
import { Schema } from "mongoose";

const gameSchema = new Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    unique: false,
    maxlength: [50, "El nombre no puede tener más de 50 caracteres"],
    minlength: [2, "El nombre no puede tener menos de 2 caracteres"],
  },
  description: {
    type: String,
    required: false,
    maxlength: 500,
  },
  gameType: {
    type: String,
    required: [true, "El tipo de juego es obligatorio"],
    enum: [
      "WordSearchGame",
      "GuessTheWordGame",
      "GuessTheImageGame",
      "GuessTheTextGame",
      "MemoryGame",
      "StrokeOrderGame",
      "MatchingGame",
      "HangmanGame",
      "SpeedMemoryWordGame",
      "SpeedMemoryImageGame",
    ],
  },
  currentGameCount: { type: Number, default: 0 },
  totalGames: {
    type: Number,
    required: [true, "El total de partidas es obligatorio"],
    min: [1, "El total de partidas debe ser mayor a 1"],
    max: [25, "El total de partidas debe ser menor a 25"],
  },
  completed: { type: Boolean, default: false },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  deck: { type: Schema.Types.ObjectId, ref: "Deck", required: true },
});

export const Game = mongoose.model("Game", gameSchema, "games");
