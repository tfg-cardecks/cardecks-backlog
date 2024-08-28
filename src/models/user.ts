import mongoose from "mongoose";
import { Schema } from "mongoose";
import { Role } from "./rol";

const countries = [
  "Argentina",
  "Australia",
  "Brazil",
  "Canada",
  "China",
  "France",
  "Germany",
  "India",
  "Italy",
  "Japan",
  "Mexico",
  "Russia",
  "South Africa",
  "Spain",
  "United Kingdom",
  "United States",
];

const userSchema = new Schema({
  createAt: { type: Date, default: Date.now() },
  name: {
    type: String,
    required: [true, "Name is required"],
    maxlength: [50, "Name too long"],
    minlength: [3, "Name too short"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    maxlength: [50, "Surname too long"],
    minlength: [3, "Surname too short"],
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    maxlength: [30, "Username too long"],
    minlength: [3, "Username too short"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlenght: [6, "Password too short"],
  },
  location: {
    type: String,
    required: [true, "Location is required"],
    enum: countries,
    trim: true,
  },
  role: {
    ref: Role,
    type: Schema.Types.String,
    required: true,
    default: "anonymous",
  },
});

export const User = mongoose.model("User", userSchema, "users");
