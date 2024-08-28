import mongoose from "mongoose";
import { Schema } from "mongoose";

const roleSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    maxlenght: [50, "Name too long"],
    minlenght: [3, "Name too short"],
    unique: true,
  },
});

export const Role = mongoose.model("Role", roleSchema, "roles");
