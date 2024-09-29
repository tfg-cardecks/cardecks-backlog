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
    maxlength: [50, "El tema es demasiado largo"],
    minlength: [3, "El tema es demasiado corto"],
  },
  cardType: {
    type: String,
    required: [true, "El tipo de carta es obligatorio"],
    enum: ["txtImg", "txtTxt"],
  },
  frontSide: {
    text: [
      {
        content: {
          type: String,
          required: false,
          validate: {
            validator: function (value: string) {
              return value.length <= 25;
            },
            message:
              "El contenido del texto no debe exceder los 25 caracteres",
          },
        },
        fontSize: { type: Number, default: 16 },
        color: { type: String, default: "#000000" },
        left: {
          type: Number,
          required: false,
          validate: {
            validator: function (value: number) {
              return value >= 0 && value <= 250;
            },
            message:
              "La posición lateral de la Parte Delantera debe estar dentro del ancho de la carta",
          },
        },
        top: {
          type: Number,
          required: false,
          validate: {
            validator: function (value: number) {
              return value >= 100 && value <= 300;
            },
            message:
              "La posición superior e inferior de la Parte Delantera debe estar dentro de la altura de la carta",
          },
        },
      },
    ],
  },
  backSide: {
    text: [
      {
        content: {
          type: String,
          required: false,
          validate: {
            validator: function (value: string) {
              return value.length <= 103;
            },
            message:
              "El contenido del texto no debe exceder los 103 caracteres",
          },
        },
        fontSize: { type: Number, default: 16 },
        color: { type: String, default: "#000000" },
        left: {
          type: Number,
          required: false,
          validate: {
            validator: function (value: number) {
              return value >= 0 && value <= 250;
            },
            message:
              "La posición lateral de la Parte Trasera debe estar dentro del ancho de la carta",
          },
        },
        top: {
          type: Number,
          required: false,
          validate: {
            validator: function (value: number) {
              return value >= 100 && value <= 400;
            },
            message:
              "La posición superior de la Parte Trasera debe estar dentro de la altura de la carta",
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
            message:
              "La posición lateral de la Parte Trasera debe estar dentro del ancho de la carta",
          },
        },
        top: {
          type: Number,
          required: false,
          validate: {
            validator: function (value: number) {
              return value >= 0 && value <= 500;
            },
            message:
              "La posición superior de la Parte Trasera debe estar dentro de la altura de la carta",
          },
        },
        width: {
          type: Number,
          validate: {
            validator: function (value: number) {
              return value > 0 && value <= 300;
            },
            message:
              "El ancho de la Parte Trasera debe estar dentro del ancho de la carta",
          },
        },
        height: {
          type: Number,
          validate: {
            validator: function (value: number) {
              return value > 0 && value <= 500;
            },
            message:
              "La altura de la Parte Trasera debe estar dentro de la altura de la carta",
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
