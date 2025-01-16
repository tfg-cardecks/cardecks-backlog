// Datos válidos para un juego de MatchingGame
export const validMatchingGame = {
  settings: {
    totalGames: 5,
    duration: 60,
    maxWords: 4,
  },
};

// Datos inválidos para un juego de MatchingGame
export const invalidMatchingGames = [
  // Faltan campos obligatorios
  {
    game: "66fdc22fedf080aa5810c6c1",
    user: "66fbdb519d600a318c38aa6c",
    deck: "66fbe3299d600a318c38aaed",
    words: ["KIKO", "PATO", "FAISAN", "GATO", "LILIL"],
    options: [
      "OPCION1",
      "OPCION2",
      "OPCION3",
      "OPCION4",
      "OPCION5",
      "OPCION6",
      "OPCION7",
      "OPCION8",
    ],
    correctAnswer: ["KIKO", "PATO", "FAISAN", "GATO"],
    status: "inProgress",
    duration: 60,
    maxWords: 4,
    attempts: 8,
  },
  // Tipos de datos incorrectos
  {
    game: "66fdc22fedf080aa5810c6c1",
    user: "66fbdb519d600a318c38aa6c",
    deck: "66fbe3299d600a318c38aaed",
    words: "not an array", // should be an array
    options: "not an array", // should be an array
    correctAnswer: "not an array", // should be an array
    status: 123, // should be a string
    duration: "sixty", // should be a number
    maxWords: "four", // should be a number
    attempts: "not a number", // should be a number
  },
];

export const validDeckForMatchingGame = {
  name: "Deck Name 3",
  description: "This is a deck description. 3",
  theme: "Deck Theme 3",
  cards: [],
};

export const validCardDeckForMatchingGame = {
  title: "Card Title 31",
  theme: "Card Theme 31",
  cardType: "txtTxt",
  frontSide: {
    text: [
      {
        content: "KIKO",
      },
    ],
  },
  backSide: {
    text: [
      {
        content: "Texto de ejemplo en la parte trasera KIKO",
      },
    ],
  },
};

export const validCard2DeckForMatchingGame = {
  title: "Card Title 32",
  theme: "Card Theme 32",
  cardType: "txtTxt",
  frontSide: {
    text: [
      {
        content: "PATO",
      },
    ],
  },
  backSide: {
    text: [
      {
        content: "Texto de ejemplo en la parte trasera PATO",
      },
    ],
  },
};

export const validCard3DeckForMatchingGame = {
  title: "Card Title 33",
  theme: "Card Theme 33",
  cardType: "txtTxt",
  frontSide: {
    text: [
      {
        content: "FAISAN",
      },
    ],
  },
  backSide: {
    text: [
      {
        content: "Texto de ejemplo en la parte trasera FAISAN",
      },
    ],
  },
};

export const validCard4DeckForMatchingGame = {
  title: "Card Title 34",
  theme: "Card Theme 34",
  cardType: "txtTxt",
  frontSide: {
    text: [
      {
        content: "GATO",
      },
    ],
  },
  backSide: {
    text: [
      {
        content: "Texto de ejemplo en la parte trasera GATO",
      },
    ],
  },
};

export const validCard5DeckForMatchingGame = {
  title: "Card Title 35",
  theme: "Card Theme 35",
  cardType: "txtTxt",
  frontSide: {
    text: [
      {
        content: "LILIL",
      },
    ],
  },
  backSide: {
    text: [
      {
        content: "Texto de ejemplo en la parte trasera LILIL",
      },
    ],
  },
};

export const validCard6DeckForMatchingGame = {
  title: "Card Title 36",
  theme: "Card Theme 36",
  cardType: "txtTxt",
  frontSide: {
    text: [
      {
        content: "PERRO",
      },
    ],
  },
  backSide: {
    text: [
      {
        content: "Texto de ejemplo en la parte trasera PERRO",
      },
    ],
  },
};

export const validCard7DeckForMatchingGame = {
  title: "Card Title 37",
  theme: "Card Theme 37",
  cardType: "txtTxt",
  frontSide: {
    text: [
      {
        content: "CABALLO",
      },
    ],
  },
  backSide: {
    text: [
      {
        content: "Texto de ejemplo en la parte trasera CABALLO",
      },
    ],
  },
};

export const validCard8DeckForMatchingGame = {
  title: "Card Title 38",
  theme: "Card Theme 38",
  cardType: "txtTxt",
  frontSide: {
    text: [
      {
        content: "ELEFANTE",
      },
    ],
  },
  backSide: {
    text: [
      {
        content: "Texto de ejemplo en la parte trasera ELEFANTE",
      },
    ],
  },
};

export const validCard9DeckForMatchingGame = {
  title: "Card Title 39",
  theme: "Card Theme 39",
  cardType: "txtTxt",
  frontSide: {
    text: [
      {
        content: "TIGRE",
      },
    ],
  },
  backSide: {
    text: [
      {
        content: "Texto de ejemplo en la parte trasera TIGRE",
      },
    ],
  },
};

export const validCard10DeckForMatchingGame = {
  title: "Card Title 40",
  theme: "Card Theme 40",
  cardType: "txtTxt",
  frontSide: {
    text: [
      {
        content: "LEON",
      },
    ],
  },
  backSide: {
    text: [
      {
        content: "Texto de ejemplo en la parte trasera LEON",
      },
    ],
  },
};