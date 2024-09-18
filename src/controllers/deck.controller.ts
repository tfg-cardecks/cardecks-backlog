import { Request, Response } from "express";
import { Types } from "mongoose";
import { Deck } from "../models/deck";
import { User } from "../models/user";
import {
  handleValidationErrors,
  handleValidationErrorsDeckUpdate,
} from "../validators/validate";
import { CustomRequest } from "../interfaces/customRequest";
import { Card } from "../models/card";
import { validateCardData } from "../validators/validate";
import { v4 as uuidv4 } from "uuid";

const findUserById = async (userId: string, res: Response) => {
  const user = await User.findById(userId);
  if (!user) {
    res.status(404).json({ message: "Usuario no encontrado" });
    return null;
  }
  return user;
};

const validateAndFindCards = async (cards: string[], res: Response) => {
  const invalidCardIds = cards.filter(
    (cardId) => !Types.ObjectId.isValid(cardId)
  );
  if (invalidCardIds.length > 0) {
    res.status(400).json({
      message: `IDs de cartas no válidos: ${invalidCardIds.join(", ")}`,
    });
    return null;
  }

  const cardIds = await Card.find({ _id: { $in: cards } }).select("_id");
  const existingCardIds = cardIds.map((card) => card._id.toString());

  const nonExistingCards = cards.filter(
    (cardId) => !existingCardIds.includes(cardId)
  );
  if (nonExistingCards.length > 0) {
    res.status(400).json({
      message: `Una o más cartas no existen: ${nonExistingCards.join(", ")}`,
    });
    return null;
  }

  return existingCardIds.map((id) => new Types.ObjectId(id));
};

const removeIds = (obj: any) => {
  if (Array.isArray(obj)) {
    obj.forEach(removeIds);
  } else if (obj && typeof obj === "object") {
    delete obj._id;
    Object.values(obj).forEach(removeIds);
  }
};

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
    if (!userId)
      return res.status(401).json({ message: "Usuario no autenticado" });

    const user = await findUserById(userId, res);
    if (!user) return;

    const { name, description, theme, cards } = req.body;

    let cardIds: Types.ObjectId[] = [];
    if (Array.isArray(cards) && cards.length > 0) {
      const validatedCardIds = await validateAndFindCards(cards, res);
      if (!validatedCardIds) return;
      cardIds = validatedCardIds;
    }

    const existingDeck = await Deck.findOne({ name });
    if (existingDeck) {
      const duplicateCards = existingDeck.cards.filter((cardId) =>
        cardIds.map((id) => id.toString()).includes(cardId.toString())
      );
      if (duplicateCards.length > 0) {
        return res
          .status(400)
          .json({ message: "Una o más cartas ya están en el mazo" });
      }
    }

    const deck = new Deck({ name, description, theme, cards: cardIds });
    await deck.save();

    user.decks.push(deck._id);
    await user.save();

    return res.status(201).json(deck);
  } catch (error: any) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Ya existe un mazo con este nombre" });
    }
    handleValidationErrors(error, res);
  }
};

export const updateDeck = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ message: "Usuario no autenticado" });

    const deck = await Deck.findById(req.params.id);
    if (!deck) return res.status(404).json({ message: "Mazo no encontrado" });

    const { theme, description, cards } = req.body;

    if (theme) deck.theme = theme;
    if (description) deck.description = description;

    if (Array.isArray(cards)) {
      const cardIds = await validateAndFindCards(cards, res);
      if (!cardIds) return;
      deck.cards = cardIds;
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

    await User.updateMany({ decks: deck._id }, { $pull: { decks: deck._id } });
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
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    return res.status(200).json(user.decks);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const exportDeck = async (req: Request, res: Response) => {
  try {
    const deckId = req.params.id;
    const deck = await Deck.findById(deckId).populate("cards");

    if (!deck) return res.status(404).json({ message: "Mazo no encontrado" });

    const uniqueSuffix = new Date().toISOString();
    const exportName = `${deck.name}-${uniqueSuffix}`;

    const deckData = deck.toJSON();

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${exportName}.json`
    );
    res.setHeader("Content-Type", "application/json");

    return res.status(200).json(deckData);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const importCardInDeck = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ message: "Usuario no autenticado" });
    const user = await findUserById(userId, res);
    if (!user) return;
    const deckId = req.params.deckId;
    const deck = await Deck.findById(deckId);
    if (!deck) return res.status(404).json({ message: "Mazo no encontrado" });

    if (!req.file) {
      return res
        .status(400)
        .json({ message: "No se ha proporcionado ningún archivo." });
    }

    const fileContent = req.file.buffer.toString("utf-8");
    let cardData;
    try {
      cardData = JSON.parse(fileContent);
    } catch (error) {
      return res
        .status(400)
        .json({ message: "El archivo proporcionado no es un JSON válido." });
    }

    try {
      validateCardData(cardData);
    } catch (error) {
      if (error instanceof Error) {
        return res
          .status(400)
          .json({ message: `Carta inválida: ${error.message}` });
      } else {
        return res
          .status(400)
          .json({ message: "Carta inválida: Error desconocido" });
      }
    }

    const uniqueSuffix = uuidv4().split("-")[0];
    cardData.title = `${cardData.title}-${uniqueSuffix}`;
    removeIds(cardData);
    const card = new Card(cardData);
    const validationError = card.validateSync();
    if (validationError) {
      return res.status(400).json({ message: validationError.message });
    }

    await card.save();
    user.cards.push(card._id);
    await user.save();
    deck.cards.push(card._id);
    await deck.save();
    return res.status(201).json(card);
  } catch (error: any) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    } else {
      return res.status(500).json({ message: "Error desconocido" });
    }
  }
};

export const importDeck = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ message: "Usuario no autenticado" });
    const user = await findUserById(userId, res);
    if (!user) return;
    if (!req.file) {
      return res.status(400).json({ message: "No se ha proporcionado ningún archivo." });
    }

    const fileContent = req.file.buffer.toString("utf-8");
    let deckData;
    try {
      deckData = JSON.parse(fileContent);
    } catch (error) {
      return res.status(400).json({ message: "El archivo proporcionado no es un JSON válido." });
    }

    if (
      !deckData.name ||
      !deckData.description ||
      !deckData.theme ||
      !Array.isArray(deckData.cards)
    ) {
      return res
        .status(400)
        .json({ message: "El archivo proporcionado no es un mazo válido." });
    }

    const uniqueSuffix = uuidv4().split("-")[0];
    const newDeck = new Deck({
      name: `${deckData.name}-${uniqueSuffix}`,
      description: deckData.description,
      theme: deckData.theme,
      cards: [],
    });

    for (const cardData of deckData.cards) {
      try {
        validateCardData(cardData);
      } catch (error) {
        if (error instanceof Error) {
          return res.status(400).json({ message: `Carta inválida en el mazo: ${error.message}` });
        } else {
          return res.status(400).json({ message: "Carta inválida en el mazo: Error desconocido" });
        }
      }

      const cardUniqueSuffix = uuidv4().split("-")[0];
      cardData.title = `${cardData.title}-${cardUniqueSuffix}`;
      removeIds(cardData);
      const card = new Card(cardData);
      const validationError = card.validateSync();
      if (validationError) {
        return res.status(400).json({ message: validationError.message });
      }
      await card.save();
      user.cards.push(card._id);
      newDeck.cards.push(card._id);
    }
    await newDeck.save();
    user.decks.push(newDeck._id);
    await user.save();
    return res.status(201).json(newDeck);
  } catch (error: any) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    } else {
      return res.status(500).json({ message: "Error desconocido" });
    }
  }
};
