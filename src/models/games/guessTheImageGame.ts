import mongoose from "mongoose";
import { Schema } from "mongoose";

const guessTheImageGameSchema = new Schema({
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
  image: {
    type: String,
    required: [true, "La imagen es obligatoria"],
  },
  options: {
    type: [String],
    required: [true, "Las opciones son obligatorias"],
  },
  correctAnswer: {
    type: String,
    required: [true, "La respuesta correcta es obligatoria"],
  },
  selectedAnswer: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    default: "inProgress",
    enum: ["inProgress", "completed"],
  },
  timeTaken: {
    type: Number,
    default: 0,
  },
});

export const GuessTheImageGame = mongoose.model(
  "GuessTheImageGame",
  guessTheImageGameSchema
);