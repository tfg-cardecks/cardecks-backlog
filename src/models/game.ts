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
    enum: ["WordSearchGame"],
  },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export const Game = mongoose.model("Game", gameSchema, "games");