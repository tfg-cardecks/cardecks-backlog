import mongoose from "mongoose";
import { Schema } from "mongoose";
import { Role } from "./role";
import { Card } from "./card";
import { Deck } from "./deck";
import { Game } from "./game";

const userSchema = new Schema({
  createAt: { type: Date, default: Date.now() },
  email: {
    type: String,
    required: [true, "El correo electrónico es obligatorio"],
    unique: true,
  },
  username: {
    type: String,
    required: [true, "El nombre de usuario es obligatorio"],
    maxlength: [30, "Nombre de usuario demasiado largo"],
    minlength: [3, "Nombre de usuario demasiado corto"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
    minlength: [6, "Contraseña demasiado corta"],
  },
  role: {
    ref: Role,
    type: Schema.Types.String,
    required: true,
    default: "anonymous",
  },
  gamesCompletedByType: {
    type: Map,
    of: Number,
    default: {},
  },
  totalGamesCompletedByType: {
    type: Map,
    of: Number,
    default: {},
  },

  cards: [{ type: Schema.Types.ObjectId, ref: Card }],
  decks: [{ type: Schema.Types.ObjectId, ref: Deck }],
  games: [{ type: Schema.Types.ObjectId, ref: Game }],
});

export const User = mongoose.model("User", userSchema, "users");