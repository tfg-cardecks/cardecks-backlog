import { red, cyan, green } from "colorette";

//local imports
import { Role } from "../models/role";
import { User } from "../models/user";
import { Deck } from "../models/deck";
import { Game } from "../models/game";

export const roles = [
  { name: "admin" },
  { name: "anonymous" },
  { name: "authenticated" },
  { name: "customer" },
];

async function createRoles() {
  for (const role of roles) {
    const rol = await Role.findOne({ name: role.name });
    if (!rol) {
      await Role.create(role);
    }
  }
}

async function createModels() {
  try {
    createRoles();
    console.log(green("Creando modelos..."));
    await User.createCollection();
    await Deck.createCollection();
    await Game.createCollection();
    console.log(cyan("Modelo de usuario creado"));
  } catch (error: any) {
    console.log(red(`No se pueden crear los modelos: ${error.message}`));
  }
}

export async function createDatabase() {
  try {
    await createModels();
  } catch (error: any) {
    console.log(red(`No se puede crear la base de datos: ${error.message}`));
  }
}

export async function getUserByEmailOrUsername(
  email: string,
  username: string
) {
  return await User.findOne({ $or: [{ email }, { username }] });
}