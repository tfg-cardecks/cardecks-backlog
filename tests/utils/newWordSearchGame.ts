// Datos válidos para un juego de sopa de letras
export const validWordSearchGame = {
  timeTaken: 0,
};

// Datos inválidos para un juego de sopa de letras
export const invalidWordSearchGames = [
  // Faltan campos obligatorios
  {
    game: "66fdc22fedf080aa5810c6c1",
    user: "66fbdb519d600a318c38aa6c",
    deck: "66fbe3299d600a318c38aaed",
    grid: [
      ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
      ["K", "L", "M", "N", "O", "P", "Q", "R", "S", "T"],
      ["U", "V", "W", "X", "Y", "Z", "A", "B", "C", "D"],
      ["E", "F", "G", "H", "I", "J", "K", "L", "M", "N"],
      ["O", "P", "Q", "R", "S", "T", "U", "V", "W", "X"],
      ["Y", "Z", "A", "B", "C", "D", "E", "F", "G", "H"],
      ["I", "J", "K", "L", "M", "N", "O", "P", "Q", "R"],
      ["S", "T", "U", "V", "W", "X", "Y", "Z", "A", "B"],
      ["C", "D", "E", "F", "G", "H", "I", "J", "K", "L"],
      ["M", "N", "O", "P", "Q", "R", "S", "T", "U", "V"],
    ],
    words: ["WORD1", "WORD2", "WORD3", "WORD4"],
    status: "completed",
    foundWords: ["WORD1", "WORD2", "WORD3", "WORD4"],
    timeTaken: 0,
    completed: true,
  },
  // Tipos de datos incorrectos
  {
    game: "66fdc22fedf080aa5810c6c1",
    user: "66fbdb519d600a318c38aa6c",
    deck: "66fbe3299d600a318c38aaed",
    grid: "not an array", // Se espera un array, pero se proporciona una cadena
    words: "not an array", // Se espera un array, pero se proporciona una cadena
    status: 123, // Se espera una cadena, pero se proporciona un número
    foundWords: "not an array", // Se espera un array, pero se proporciona una cadena
    timeTaken: "zero", // Se espera un número, pero se proporciona una cadena
    completed: "yes", // Se espera un booleano, pero se proporciona una cadena
    __v: "one", // Se espera un número, pero se proporciona una cadena
  },
  // Valores fuera de los límites permitidos
  {
    game: "66fdc22fedf080aa5810c6c1",
    user: "66fbdb519d600a318c38aa6c",
    deck: "66fbe3299d600a318c38aaed",
    grid: [
      ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
      ["K", "L", "M", "N", "O", "P", "Q", "R", "S", "T"],
      ["U", "V", "W", "X", "Y", "Z", "A", "B", "C", "D"],
      ["E", "F", "G", "H", "I", "J", "K", "L", "M", "N"],
      ["O", "P", "Q", "R", "S", "T", "U", "V", "W", "X"],
      ["Y", "Z", "A", "B", "C", "D", "E", "F", "G", "H"],
      ["I", "J", "K", "L", "M", "N", "O", "P", "Q", "R"],
      ["S", "T", "U", "V", "W", "X", "Y", "Z", "A", "B"],
      ["C", "D", "E", "F", "G", "H", "I", "J", "K", "L"],
      ["M", "N", "O", "P", "Q", "R", "S", "T", "U", "V"],
    ],
    words: ["WORD1", "WORD2", "WORD3", "WORD4"],
    status: "completed",
    foundWords: ["WORD1", "WORD2", "WORD3", "WORD4"],
    timeTaken: -1, // Valor fuera de los límites permitidos
    completed: true,
  },
];

export const validDeckForWordSearchGame = {
  name: "Deck Name 3",
  description: "This is a deck description. 3",
  theme: "Deck Theme 3",
  cards: [],
};

export const validCardDeckForWordSearchGame = {
  title: "Card Title 31",
  theme: "Card Theme 31",
  cardType: "txtTxt",
  frontSide: {
    text: [
      {
        content: "Texto",
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

export const validCard2DeckForWordSearchGame = {
  title: "Card Title 32",
  theme: "Card Theme 32",
  cardType: "txtTxt",
  frontSide: {
    text: [
      {
        content: "Texto",
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

export const validCard3DeckForWordSearchGame = {
  title: "Card Title 33",
  theme: "Card Theme 33",
  cardType: "txtTxt",
  frontSide: {
    text: [
      {
        content: "Texto",
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

export const validCard4DeckForWordSearchGame = {
  title: "Card Title 34",
  theme: "Card Theme 34",
  cardType: "txtTxt",
  frontSide: {
    text: [
      {
        content: "Texto",
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

export const validCard5DeckForWordSearchGame = {
  title: "Card Title 35",
  theme: "Card Theme 35",
  cardType: "txtTxt",
  frontSide: {
    text: [
      {
        content: "Texto",
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
