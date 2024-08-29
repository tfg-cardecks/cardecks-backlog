import mongoose from "mongoose";
import { Schema } from "mongoose";

const deskSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    maxlength: [50, "Name too long"],
    minlength: [3, "Name too short"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    maxlength: [500, "Description too long"],
    minlength: [3, "Description too short"],
  },
  theme: {
    type: String,
    enum: ["Cultura", "Gramática", "Vocabulario", "Ejercicio", "Libre"],
    required: [true, "Theme is required"],
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
