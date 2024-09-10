import { Request, Response } from "express";

//local imports
import { Card } from "../models/card";
import { handleValidationErrors } from "../validators/validate";
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
    if (!card) return res.status(404).json({ message: "Card not found" });
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
      return res.status(401).json({ message: "User not authenticated" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { frontImageUrl, backImageUrl } = await generateCardImage(cardData);
    cardData.frontImageUrl = frontImageUrl;
    cardData.backImageUrl = backImageUrl;

    const card = new Card(cardData);
    await card.save();

    user.cards.push(card._id);
    await user.save();

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

export const getCardsByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate("cards");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json(user.cards);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
