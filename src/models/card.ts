import mongoose from "mongoose";
import { Schema } from "mongoose";

const cardSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    maxlength: [50, "Title too long"],
    minlength: [3, "Title too short"],
  },
  cardWidth: { type: Number, default: 500, immutable: true },
  cardHeight: { type: Number, default: 300, immutable: true },
  theme: {
    type: String,
    enum: ["Cultura", "Gramática", "Vocabulario", "Ejercicio", "Libre"],
    required: [true, "Theme is required"],
  },
  frontSide: {
    text: [
      {
        content: { type: String, required: false },
        fontSize: { type: Number, default: 16 },
        color: { type: String, default: "#000000" },
        left: { type: Number, required: false },
        top: { type: Number, required: false },
      },
    ],
    shapes: [
      {
        type: { type: String, required: false },
        left: { type: Number, required: false },
        top: { type: Number, required: false },
        width: { type: Number },
        height: { type: Number },
        radius: { type: Number },
        fill: { type: String, default: "#000000" },
      },
    ],
    images: [
      {
        url: { type: String, required: false },
        dataFile: { type: Buffer, required: false }, 
        contentType: { type: String, required: false },
        left: { type: Number, required: false },
        top: { type: Number, required: false },
        width: { type: Number },
        height: { type: Number },
      },
    ],
  },
  backSide: {
    text: [
      {
        content: { type: String, required: false },
        fontSize: { type: Number, default: 16 },
        color: { type: String, default: "#000000" },
        left: { type: Number, required: false },
        top: { type: Number, required: false },
      },
    ],
    shapes: [
      {
        type: { type: String, required: false },
        left: { type: Number, required: false },
        top: { type: Number, required: false },
        width: { type: Number },
        height: { type: Number },
        radius: { type: Number },
        fill: { type: String, default: "#000000" },
      },
    ],
    images: [
      {
        url: { type: String, required: false },
        dataFile: { type: Buffer, required: false }, 
        contentType: { type: String, required: false },
        left: { type: Number, required: false },
        top: { type: Number, required: false },
        width: { type: Number },
        height: { type: Number },
      },
    ],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Card = mongoose.model("Card", cardSchema, "cards");
