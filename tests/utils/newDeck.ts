// name, description, theme, cards
export const deck = {
  name: "Deck Name",
  description: "Deck Description",
  theme: "Deck Theme",
  cards: [],
};

export const deck2 = {
  name: "Deck Name 2",
  description: "Deck Description 2",
  theme: "Deck Theme 2",
  cards: [],
};

export const badDecks = [
  // Name required
  {
    description: "Deck Description",
    theme: "Deck Theme",
  },
  // Description required
  {
    name: "Deck Name",
    theme: "Deck Theme",
  },
  // Theme required
  {
    name: "Deck Name",
    description: "Deck Description",
  },
  // Name is too short
  {
    name: "D",
    description: "Deck Description",
    theme: "Deck Theme",
  },
  // Description is too short
  {
    name: "Deck Name",
    description: "D",
    theme: "Deck Theme",
  },
  // Theme is too short
  {
    name: "Deck Name",
    description: "Deck Description",
    theme: "D",
  },
  // Name is too long
  {
    name: "El nombre que uso es este que es un nombre de deck demasiado largo para ser aceptado por el sistema",
    description: "Deck Description",
    theme: "Deck Theme",
  },
  // Description too long
  {
    name: "Deck Name",
    description:
      "Esta es una descripción de deck demasiado larga para ser aceptada por el sistema. " +
      "Debe ser más corta para cumplir con los requisitos del esquema. " +
      "Esta es una descripción de deck demasiado larga para ser aceptada por el sistema. " +
      "Debe ser más corta para cumplir con los requisitos del esquema. " +
      "Esta es una descripción de deck demasiado larga para ser aceptada por el sistema. " +
      "Debe ser más corta para cumplir con los requisitos del esquema.",
    theme: "Deck Theme",
  },
  // Theme too long
  {
    name: "Deck Name",
    description: "Deck Description",
    theme:
      "El tema que uso es este que es un tema de deck demasiado largo para ser aceptado por el sistema",
  },
  // Cards with invalid ObjectId
  {
    name: "Deck Name",
    description: "Deck Description",
    theme: "Deck Theme",
    cards: ["invalidObjectId"],
  },
];
