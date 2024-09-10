import mongoose from "mongoose";
import { Schema } from "mongoose";

const cardSchema = new Schema({
  title: {
    type: String,
    required: [true, "El título es obligatorio"],
    maxlength: [50, "Título demasiado largo"],
    minlength: [3, "Título demasiado corto"],
    unique: true,
  },
  cardWidth: { type: Number, default: 300, immutable: true },
  cardHeight: { type: Number, default: 500, immutable: true },
  theme: {
    type: String,
    required: [true, "El tema es obligatorio"],
  },
  cardType: {
    type: String,
    required: [true, "El tipo de carta es obligatorio"],
    enum: ["txtImg", "txtTxt"],
  },
  frontSide: {
    text: [
      {
        content: { type: String, required: false },
        fontSize: { type: Number, default: 16 },
        color: { type: String, default: "#000000" },
        left: {
          type: Number,
          required: false,
          validate: {
            validator: function (value: number) {
              return value >= 0 && value <= 150;
            },
            message: "La posición izquierda debe estar dentro del ancho de la carta",
          },
        },
        top: {
          type: Number,
          required: false,
          validate: {
            validator: function (value: number) {
              return value >= 100 && value <= 300;
            },
            message: "La posición superior debe estar dentro de la altura de la carta",
          },
        },
      },
    ],
  },
  backSide: {
    text: [
      {
        content: { type: String, required: false },
        fontSize: { type: Number, default: 16 },
        color: { type: String, default: "#000000" },
        left: {
          type: Number,
          required: false,
          validate: {
            validator: function (value: number) {
              return value >= 0 && value <= 100;
            },
            message: "La posición izquierda debe estar dentro del ancho de la carta",
          },
        },
        top: {
          type: Number,
          required: false,
          validate: {
            validator: function (value: number) {
              return value >= 100 && value <= 300;
            },
            message: "La posición superior debe estar dentro de la altura de la carta",
          },
        },
      },
    ],
    images: [
      {
        url: { type: String, required: false },
        dataFile: { type: Buffer, required: false },
        contentType: { type: String, required: false },
        left: {
          type: Number,
          required: false,
          validate: {
            validator: function (value: number) {
              return value >= 0 && value <= 300;
            },
            message: "La posición izquierda debe estar dentro del ancho de la carta",
          },
        },
        top: {
          type: Number,
          required: false,
          validate: {
            validator: function (value: number) {
              return value >= 0 && value <= 500;
            },
            message: "La posición superior debe estar dentro de la altura de la carta",
          },
        },
        width: {
          type: Number,
          validate: {
            validator: function (value: number) {
              return value > 0 && value <= 300;
            },
            message: "El ancho debe estar dentro del ancho de la carta",
          },
        },
        height: {
          type: Number,
          validate: {
            validator: function (value: number) {
              return value > 0 && value <= 500;
            },
            message: "La altura debe estar dentro de la altura de la carta",
          },
        },
      },
    ],
  },
  frontImageUrl: { type: String, required: false },
  backImageUrl: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Card = mongoose.model("Card", cardSchema, "cards");