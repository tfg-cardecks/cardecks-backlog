import mongoose from "mongoose";
import { Schema } from "mongoose";
import { Card } from "./card";

const deckSchema = new Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    maxlength: [50, "Nombre demasiado largo"],
    minlength: [3, "Nombre demasiado corto"],
  },
  description: {
    type: String,
    required: [true, "La descripción es obligatoria"],
    maxlength: [500, "Descripción demasiado largo"],
    minlength: [3, "Descripción demasiado corto"],
  },
  theme: {
    type: String,
    required: [true, "El tema es obligatorio"],
    maxlength: [50, "Tema demasiado largo"],
    minlength: [3, "Tema demasiado corto"],

  },

  cards: [
    {
      type: Schema.Types.ObjectId,
      ref: Card,
    },
  ],
  createAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

export const Deck = mongoose.model("Deck", deckSchema, "decks");