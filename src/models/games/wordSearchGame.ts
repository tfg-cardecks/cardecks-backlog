import mongoose from "mongoose";
import { Schema } from "mongoose";

const wordSearchGameSchema = new Schema({
  game: {
    type: Schema.Types.ObjectId,
    ref: "Game",
    required: [true, "El juego es obligatorio"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "El usuario es obligatorio"],
  },
  deck: {
    type: Schema.Types.ObjectId,
    ref: "Deck",
    required: [true, "El mazo es obligatorio"],
  },
  grid: {
    type: [[String]],
    required: [true, "La cuadrícula es obligatoria"],
  },
  words: {
    type: [String],
    required: [true, "Las palabras son obligatorias"],
  },
  status: {
    type: String,
    default: "inProgress",
    enum: ["inProgress", "completed"],
  },
  foundWords: {
    type: [String],
    default: [],
  },
  duration: {
    type: Number,
    required: [true, "La duración es obligatoria"],
  },
  maxWords: {
    type: Number,
    required: [true, "El número máximo de palabras es obligatorio"],
  },
  score: {
    type: Number,
    default: 0,
  },
});

export const WordSearchGame = mongoose.model(
  "WordSearchGame",
  wordSearchGameSchema,
  "wordSearchGames"
);
