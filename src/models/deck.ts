import mongoose from "mongoose";
import { Schema } from "mongoose";

const deckSchema = new Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    maxlength: [50, "Nombre demasiado largo"],
    minlength: [3, "Nombre demasiado corto"],
    unique: true,
  },
  description: {
    type: String,
    required: [true, "La descripción es obligatoria"],
    maxlength: [500, "Descripción demasiado larga"],
    minlength: [3, "Descripción demasiado corta"],
  },
  theme: {
    type: String,
    required: [true, "El tema es obligatorio"],
  },

  cards: [
    {
      type: Schema.Types.ObjectId,
      ref: "Card",
    },
  ],
  createAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

export const Deck = mongoose.model("Deck", deckSchema, "decks");