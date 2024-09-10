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
  timeTaken: {
    type: Number,
    default: 0,
  },
  theme: {
    type: String,
    enum: ["Animals", "Colors"],
    required: [true, "El tema es obligatorio"],
  },
  completed: { type: Boolean, default: false },
});

export const WordSearchGame = mongoose.model(
  "WordSearchGame",
  wordSearchGameSchema,
  "wordSearchGames"
);