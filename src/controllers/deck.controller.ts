import { Request, Response } from "express";
import { Types } from "mongoose";

//local imports
import { Deck } from "../models/deck";
import { User } from "../models/user";
import { handleValidationErrors, handleValidationErrorsDeckUpdate } from "../validators/validate";
import { CustomRequest } from "../interfaces/customRequest";
import { Card } from "../models/card";

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
    const deck = await Deck.findById(req.params.id).populate("cards");
    if (!deck) return res.status(404).json({ message: "Mazo no encontrado" });
    return res.status(200).json(deck);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const createDeck = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?.id; 
    const { name, description, theme, cards } = req.body;
    
    if (!userId) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    let cardIds = [];
    if (Array.isArray(cards) && cards.length > 0) {
      cardIds = await Card.find({ _id: { $in: cards } }).select('_id');
      if (cardIds.length !== cards.length) {
        return res.status(400).json({ message: "Una o más cartas no existen" });
      }
    }

    const existingDeck = await Deck.findOne({ name });
    if (existingDeck) {
      const duplicateCards = existingDeck.cards.filter(cardId => cardIds.map(id => id.toString()).includes(cardId.toString()));
      if (duplicateCards.length > 0) {
        return res.status(400).json({ message: "Una o más cartas ya están en el mazo" });
      }
    }

    const deck = new Deck({ name, description, theme, cards: cardIds });
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

export const updateDeck = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { theme, description, cards } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const deck = await Deck.findById(req.params.id);
    if (!deck) return res.status(404).json({ message: "Mazo no encontrado" });

    if (theme) deck.theme = theme;
    if (description) deck.description = description;

    if (Array.isArray(cards)) {
      const invalidCardIds = cards.filter(cardId => !Types.ObjectId.isValid(cardId));
      if (invalidCardIds.length > 0) {
        return res.status(400).json({ message: `IDs de cartas no válidos: ${invalidCardIds.join(', ')}` });
      }

      const cardIds = await Card.find({ _id: { $in: cards } }).select('_id');
      const existingCardIds = cardIds.map(card => card._id.toString());

      const nonExistingCards = cards.filter(cardId => !existingCardIds.includes(cardId));
      if (nonExistingCards.length > 0) {
        return res.status(400).json({ message: `Una o más cartas no existen: ${nonExistingCards.join(', ')}` });
      }
      deck.cards = existingCardIds.map(id => new Types.ObjectId(id));
    }

    await deck.save();
    return res.status(200).json(deck);
  } catch (error: any) {
    handleValidationErrorsDeckUpdate(error, res);
  }
};

export const deleteDeck = async (req: Request, res: Response) => {
  try {
    const deck = await Deck.findByIdAndDelete(req.params.id);
    if (!deck) return res.status(404).json({ message: "Mazo no encontrado" });

    await Card.updateMany(
      { _id: { $in: deck.cards } },
      { $pull: { decks: deck._id } }
    );

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