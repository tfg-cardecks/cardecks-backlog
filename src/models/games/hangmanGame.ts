import mongoose from "mongoose";
import { Schema } from "mongoose";

const hangmanGameSchema = new Schema({
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
  },
  status: {
    type: String,
    default: "inProgress",
    enum: ["inProgress", "completed"],
  },
  foundLetters: {
    type: [String],
    default: [],
  },
  wrongLetters: {
    type: [String],
    default: [],
  },
  foundWord: {
    type: String,
    default: "",
  },
  currentWordIndex: {
    type: Number,
    default: 0,
  },
  currentWord: {
    type: String,
    default: "",
  },
  timeTaken: {
    type: Number,
    default: 0,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

export const HangmanGame = mongoose.model("HangmanGame", hangmanGameSchema);
