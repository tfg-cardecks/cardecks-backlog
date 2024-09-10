import { Request, Response } from "express";

// Local imports
import { Card } from "../models/card";
import {
  handleSpecificValidationErrors,
  validateCardData,
} from "../validators/validate";
import { User } from "../models/user";
import { CustomRequest } from "../interfaces/customRequest";
import { generateCardImage } from "../utils/generateCardImage";

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
    if (!card) return res.status(404).json({ message: "Carta no encontrada" });
    return res.status(200).json(card);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const createCard = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const cardData = req.body;

    if (!userId)
      return res.status(401).json({ message: "Usuario no autenticado" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    validateCardData(cardData);

    const card = new Card(cardData);
    const validationError = card.validateSync();
    if (validationError) {
      return res.status(400).json({ message: validationError.message });
    }

    const { frontImageUrl, backImageUrl } = await generateCardImage(cardData);
    card.frontImageUrl = frontImageUrl;
    card.backImageUrl = backImageUrl;

    await card.save();

    user.cards.push(card._id);
    await user.save();

    return res.status(201).json(card);
  } catch (error: any) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Ya existe una carta con este título" });
    }
    handleSpecificValidationErrors(error, res);
  }
};

export const updateCard = async (req: Request, res: Response) => {
  try {
    const cardData = req.body;
    validateCardData(cardData);

    const card = await Card.findByIdAndUpdate(req.params.id, cardData, {
      runValidators: true,
    });
    if (!card) return res.status(404).json({ message: "Carta no encontrada" });
    return res.status(200).json(card);
  } catch (error: any) {
    handleSpecificValidationErrors(error, res);
  }
};

export const deleteCard = async (req: Request, res: Response) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.id);
    if (!card) return res.status(404).json({ message: "Carta no encontrada" });
    return res.status(204).json({ message: "Carta eliminada con éxito" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCardsByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate("cards");
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    return res.status(200).json(user.cards);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};