import mongoose from "mongoose";
import { Schema } from "mongoose";

const roleSchema = new Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    maxlength: [50, "Nombre demasiado largo"],
    minlength: [3, "Nombre demasiado corto"],
    unique: true,
  },
});

export const Role = mongoose.model("Role", roleSchema, "roles");