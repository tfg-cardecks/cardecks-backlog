import mongoose from "mongoose";
import { Schema } from "mongoose";

const wordSearchGameSchema = new Schema({
  game: {
    type: Schema.Types.ObjectId,
    ref: "Game",
    required: [true, "Game is required"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"],
  },
  grid: {
    type: [[String]],
    required: [true, "Grid is required"],
  },
  words: {
    type: [String],
    required: [true, "Words are required"],
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
    required: [true, "Theme is required"],
  },
  completed: { type: Boolean, default: false },
});

export const WordSearchGame = mongoose.model(
  "wordSearchGame",
  wordSearchGameSchema,
  "wordSearchGames"
);
