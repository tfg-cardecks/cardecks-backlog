import mongoose from "mongoose";
import { Schema } from "mongoose";

const gameSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: false,
    maxlength: [50, "Name can't be longer than 50 characters"],
    minlength: [2, "Name can't be shorter than 2 characters"],
  },
  description: {
    type: String,
    required: false,
    maxlength: 500,
  },
  gameType: {
    type: String,
    required: [true, "Game Type is required"],
    enum: ["WordSearchGame"],
  },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export const Game = mongoose.model("Game", gameSchema, "games");
