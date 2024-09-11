import { Request, Response } from "express";

//local imports
import { Deck } from "../models/deck";
import { User } from "../models/user";
import { handleValidationErrors } from "../validators/validate";
import { CustomRequest } from "../interfaces/customRequest";

export const getDecks = async (_req: Request, res: Response) => {
  try {
    const desks = await Deck.find();
    return res.status(200).json(desks);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getDeckById = async (req: Request, res: Response) => {
  try {
    const deck = await Deck.findById(req.params.id);
    if (!deck) return res.status(404).json({ message: "Mazo no encontrado" });
    return res.status(200).json(deck);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const createDeck = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?.id; 
    const deskData = req.body;

    if (!userId)
      return res.status(401).json({ message: "Usuario no autenticado" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const deck = new Deck(deskData);
    await deck.save();

    user.decks.push(deck._id);
    await user.save();

    return res.status(201).json(deck);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Ya existe un mazo con este nombre" });
    }
    handleValidationErrors(error, res);
  }
};

export const updateDeck = async (req: Request, res: Response) => {
  try {
    const deck = await Deck.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
    });
    if (!deck) return res.status(404).json({ message: "Mazo no encontrado" });
    return res.status(200).json(deck);
  } catch (error: any) {
    handleValidationErrors(error, res);
  }
};

export const deleteDeck = async (req: Request, res: Response) => {
  try {
    const deck = await Deck.findByIdAndDelete(req.params.id);
    if (!deck) return res.status(404).json({ message: "Mazo no encontrado" });
    return res.status(204).json({ message: "Mazo eliminado con éxito" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getDecksByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate("decks");
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    return res.status(200).json(user.decks);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};