import { Request, Response } from "express";

//local imports
import { Card } from "../models/card";
import { handleValidationErrors } from "../validators/validate";

export const getCards = async (_req: Request, res: Response) => {
  try {
    const cards = await Card.find();
    return res.status(200).json(cards);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCardById = async (req: Request, res: Response) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: "Card not found" });
    return res.status(200).json(card);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const createCard = async (req: Request, res: Response) => {
  try {
    const card = new Card(req.body);
    await card.save();
    return res.status(201).json(card);
  } catch (error: any) {
    handleValidationErrors(error, res);
  }
};

export const updateCard = async (req: Request, res: Response) => {
  try {
    const card = await Card.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
    });
    if (!card) return res.status(404).json({ message: "Card not found" });
    return res.status(200).json(card);
  } catch (error: any) {
    handleValidationErrors(error, res);
  }
};

export const deleteCard = async (req: Request, res: Response) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.id);
    if (!card) return res.status(404).json({ message: "Card not found" });
    return res.status(204).json({ message: "Card deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
