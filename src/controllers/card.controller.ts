import { Request, Response } from "express";

// Local imports
import { Card } from "../models/card";
import { Deck } from "../models/deck";
import {
  handleSpecificValidationErrors,
  validateCardData,
} from "../validators/validate";
import { User } from "../models/user";
import { CustomRequest } from "../interfaces/customRequest";
import { generateCardImage } from "../utils/generateCardImage";
import { editCardImage } from "../utils/editCardImage";
import { v4 as uuidv4 } from "uuid";

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
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    cardData.frontSide = cardData.frontSide || { text: [] };
    cardData.backSide = cardData.backSide || { text: [], images: [] };

    validateCardData(cardData);

    const card = new Card(cardData);
    const validationError = card.validateSync();
    if (validationError) {
      const errorMessages = Object.values(validationError.errors).map(
        (error: any) => error.message
      );
      const formattedErrorMessages = errorMessages.join("\n");
      return res.status(400).json({ message: formattedErrorMessages });
    }
    const suffix = Date.now().toString();

    try {
      const { frontImageUrl, backImageUrl } = await generateCardImage(
        cardData,
        suffix
      );
      card.frontImageUrl = frontImageUrl;
      card.backImageUrl = backImageUrl;
    } catch (imageError) {
      const errorMessage =
        imageError instanceof Error ? imageError.message : "Error desconocido";
      return res.status(500).json({
        message: `Error al generar la imagen de la carta: ${errorMessage}`,
      });
    }

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

    const existingCard = await Card.findById(req.params.id);
    if (!existingCard)
      return res.status(404).json({ message: "Carta no encontrada" });

    cardData._id = existingCard._id;

    if (!cardData.theme) {
      cardData.theme = existingCard.theme;
    }
    cardData.title = cardData.title || existingCard.title;
    cardData.theme = cardData.theme || existingCard.theme;


    const frontSideModified =
      JSON.stringify(existingCard.frontSide) !==
      JSON.stringify(cardData.frontSide);
    const backSideModified =
      JSON.stringify(existingCard.backSide) !==
      JSON.stringify(cardData.backSide);
    const themeModified = existingCard.theme !== cardData.theme;

    const suffix = Date.now().toString();

    if (frontSideModified || backSideModified || themeModified) {
      try {
        const { frontImageUrl, backImageUrl } = await editCardImage(
          cardData,
          suffix
        );
        cardData.frontImageUrl = frontImageUrl;
        cardData.backImageUrl = backImageUrl;
      } catch (imageError) {
        const errorMessage =
          imageError instanceof Error
            ? imageError.message
            : "Error desconocido";
        return res.status(500).json({
          message: `Error al generar la imagen de la carta: ${errorMessage}`,
        });
      }
    }

    const updatedCardData = {
      ...existingCard.toObject(),
      ...cardData,
    };

    const updatedCard = await Card.findByIdAndUpdate(
      req.params.id,
      updatedCardData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCard)
      return res.status(404).json({ message: "Carta no encontrada" });

    return res.status(200).json(updatedCard);
  } catch (error: any) {
    handleSpecificValidationErrors(error, res);
  }
};

export const deleteCard = async (req: Request, res: Response) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.id);
    if (!card) return res.status(404).json({ message: "Carta no encontrada" });

    await User.updateMany({ cards: card._id }, { $pull: { cards: card._id } });

    await Deck.updateMany({ cards: card._id }, { $pull: { cards: card._id } });

    return res.status(204).json({ message: "Carta eliminada con éxito" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCardsByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate("cards");
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    return res.status(200).json(user.cards);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const exportCard = async (req: Request, res: Response) => {
  try {
    const cardId = req.params.id;
    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).json({ message: "Carta no encontrada" });
    }

    const uniqueSuffix = new Date().toISOString();
    const exportTitle = `${card.title}-${uniqueSuffix}`;

    const cardData = card.toJSON();

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${exportTitle}.json`
    );
    res.setHeader("Content-Type", "application/json");

    return res.status(200).json(cardData);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const importCard = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId)
      return res.status(401).json({ message: "Usuario no autenticado" });

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

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
    const removeIds = (obj: any) => {
      if (Array.isArray(obj)) {
        obj.forEach(removeIds);
      } else if (obj && typeof obj === "object") {
        delete obj._id;
        Object.values(obj).forEach(removeIds);
      }
    };
    removeIds(cardData);
    const card = new Card(cardData);
    const validationError = card.validateSync();
    if (validationError) {
      return res.status(400).json({ message: validationError.message });
    }

    await card.save();
    user.cards.push(card._id);
    await user.save();
    return res.status(201).json(card);
  } catch (error: any) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    } else {
      return res.status(500).json({ message: "Error desconocido" });
    }
  }
};

export const autocompleteCardThemes = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    if (!query || typeof query !== "string") {
      return res.status(400).json({ message: "Consulta no válida" });
    }

    const themes = await Card.distinct("theme", {
      theme: { $regex: query, $options: "i" },
    });

    return res.status(200).json(themes);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
