import mongoose from "mongoose";
import { Schema } from "mongoose";

const matchingGameSchema = new Schema({
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
    type: [String],
    required: [true, "Las palabras son obligatorias"],
    validate: {
      validator: function (words: string[]) {
        return words.length >= 2 && words.length <= 4;
      },
      message: "El total de palabras debe estar entre 2 y 4",
    },
  },
  options: {
    type: [String],
    required: [true, "Las opciones son obligatorias"],
    validate: {
      validator: function (options: string[]) {
        return options.length === (this as any).words.length * 2;
      },
      message: "El número de opciones debe ser el doble del número de palabras",
    },
  },
  correctAnswer: {
    type: Map,
    of: String,
    required: [true, "Las respuestas correctas son obligatorias"],
  },
  selectedAnswer: {
    type: Map,
    of: String,
    default: {},
  },
  status: {
    type: String,
    default: "inProgress",
    enum: ["inProgress", "completed"],
  },
  duration: {
    type: Number,
    required: [true, "La duración es obligatoria"],
    min: [5, "La duración mínima es 5 segundos"],
    max: [300, "La duración máxima es 300 segundos"],
  },
  maxWords: {
    type: Number,
    required: [true, "El número máximo de palabras es obligatorio"],
    min: [2, "EL total de palabras debe estar entre 2 y 4"],
    max: [4, "EL total de palabras debe estar entre 2 y 4"],
  },
  score: {
    type: Number,
    default: 0,
  },
  attempts: {
    type: Number,
    default: 0,
  },
});

export const MatchingGame = mongoose.model(
  "MatchingGame",
  matchingGameSchema,
  "matchingGames"
);
