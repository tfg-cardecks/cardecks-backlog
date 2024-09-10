import mongoose from "mongoose";
import { Schema } from "mongoose";
import { Role } from "./role";
import { Card } from "./card";
import { Desk } from "./desk";
import { Game } from "./game";

const userSchema = new Schema({
  createAt: { type: Date, default: Date.now() },
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    maxlength: [50, "Nombre demasiado largo"],
    minlength: [3, "Nombre demasiado corto"],
  },
  lastName: {
    type: String,
    required: [true, "El apellido es obligatorio"],
    maxlength: [50, "Apellido demasiado largo"],
    minlength: [3, "Apellido demasiado corto"],
  },
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
  cards: [{ type: Schema.Types.ObjectId, ref: Card }],
  desks: [{ type: Schema.Types.ObjectId, ref: Desk }],
  games: [{ type: Schema.Types.ObjectId, ref: Game }],
});

export const User = mongoose.model("User", userSchema, "users");