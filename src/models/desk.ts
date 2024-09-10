import mongoose from "mongoose";
import { Schema } from "mongoose";

const deskSchema = new Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    maxlength: [50, "Nombre demasiado largo"],
    minlength: [3, "Nombre demasiado corto"],
  },
  description: {
    type: String,
    required: [true, "La descripción es obligatoria"],
    maxlength: [500, "Descripción demasiado larga"],
    minlength: [3, "Descripción demasiado corta"],
  },
  theme: {
    type: String,
    enum: ["Cultura", "Gramática", "Vocabulario", "Ejercicio", "Libre"],
    required: [true, "El tema es obligatorio"],
  },

  cards: [
    {
      type: Schema.Types.ObjectId,
      ref: "Card",
    },
  ],
  numberOfCards: {
    type: Number,
    default: 0,
  },

  createAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

export const Desk = mongoose.model("Desk", deskSchema, "desks");