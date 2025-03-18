import mongoose from "mongoose";
import { Schema } from "mongoose";

const wordSchema = new Schema({
  grid: {
    type: [String],
    required: [true, "La cuadrícula es obligatoria"],
  },
  word: {
    type: String,
    required: [true, "La palabra original es obligatoria"],
  },
  foundLetters: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    default: "inProgress",
    enum: ["inProgress", "completed"],
  },
});

const letterOrderGameSchema = new Schema({
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
  words: {
    type: [wordSchema],
    required: [true, "Las palabras son obligatorias"],
  },
  numWords: {
    type: Number,
    required: [true, "El número de palabras es obligatorio"],
    min: [1, "El número de palabras debe estar entre 1 y 2"],
    max: [2, "El número de palabras debe estar entre 1 y 2"],
  },
  duration: {
    type: Number,
    required: [true, "La duración es obligatoria"],
    min: [5, "La duración mínima es 5 segundos"],
    max: [300, "La duración máxima es 300 segundos"],
  },
  status: {
    type: String,
    default: "inProgress",
    enum: ["inProgress", "completed"],
  },
});

export const LetterOrderGame = mongoose.model(
  "LetterOrderGame",
  letterOrderGameSchema,
  "letterOrderGames"
);
