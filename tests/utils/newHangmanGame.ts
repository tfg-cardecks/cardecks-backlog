// Datos válidos para un juego de Hangman
export const validHangmanGame = {
  settings: {
    totalGames: 1,
    duration: 60,
  },
};

// Datos inválidos para un juego de Hangman
export const invalidHangmanGames = [
  // Faltan campos obligatorios
  {
    game: "66fdc22fedf080aa5810c6c1",
    user: "66fbdb519d600a318c38aa6c",
    deck: "66fbe3299d600a318c38aaed",
    words: ["KIKO", "PATO", "FAISAN", "GATO", "LILIL"],
    status: "inProgress",
    completed: false,
  },
  // Tipos de datos incorrectos
  {
    game: "66fdc22fedf080aa5810c6c1",
    user: "66fbdb519d600a318c38aa6c",
    deck: "66fbe3299d600a318c38aaed",
    words: "not an array", // should be an array
    currentWordIndex: "zero", // should be a number
    foundLetters: "not an array", // should be an array
    wrongLetters: "not an array", // should be an array
    status: 123, // should be a string
    completed: "yes", // should be a boolean
  },
];

export const validDeckForHangmanGame = {
  name: "Deck Name 3",
  description: "This is a deck description. 3",
  theme: "Deck Theme 3",
  cards: [],
};

export const validCardDeckForHangmanGame = {
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
        content: "Texto de ejemplo en la parte trasera 1",
      },
    ],
  },
};

export const validCard2DeckForHangmanGame = {
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
        content: "Texto de ejemplo en la parte trasera 2",
      },
    ],
  },
};

export const validCard3DeckForHangmanGame = {
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
        content: "Texto de ejemplo en la parte trasera 3",
      },
    ],
  },
};

export const validCard4DeckForHangmanGame = {
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
        content: "Texto de ejemplo en la parte trasera 4",
      },
    ],
  },
};

export const validCard5DeckForHangmanGame = {
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
        content: "Texto de ejemplo en la parte trasera 5",
      },
    ],
  },
};
