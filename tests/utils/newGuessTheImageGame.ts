// Datos válidos para un juego de adivinar la imagen
export const validGuessTheImageGame = {
  timeTaken: 0,
};

// Datos inválidos para un juego de adivinar la imagen
export const invalidGuessTheImageGames = [
  // Faltan campos obligatorios
  {
    game: "66fdc22fedf080aa5810c6c1",
    user: "66fbdb519d600a318c38aa6c",
    deck: "66fbe3299d600a318c38aaed",
    image: "https://example.com/image.jpg",
    options: ["OPTION1", "OPTION2", "OPTION3", "OPTION4"],
    correctAnswer: "OPTION1",
    status: "completed",
    selectedAnswer: "OPTION1",
    timeTaken: 0,
  },
  // Tipos de datos incorrectos
  {
    game: "66fdc22fedf080aa5810c6c1",
    user: "66fbdb519d600a318c38aa6c",
    deck: "66fbe3299d600a318c38aaed",
    image: 123, // should be a string
    options: "not an array", // should be an array
    correctAnswer: 123, // should be a string
    status: 123, // should be a string
    selectedAnswer: 123, // should be a string
    timeTaken: "zero", // should be a number
  },
  {
    game: "66fdc22fedf080aa5810c6c1",
    user: "66fbdb519d600a318c38aa6c",
    deck: "66fbe3299d600a318c38aaed",
    image: "https://example.com/image.jpg",
    options: ["OPTION1", "OPTION2", "OPTION3", "OPTION4"],
    correctAnswer: "OPTION1",
    status: "completed",
    selectedAnswer: "OPTION1",
    timeTaken: -1, // should be a positive number
  },
];

export const validDeckForGuessTheImageGame = {
  name: "Deck Name 3",
  description: "This is a deck description. 3",
  theme: "Deck Theme 3",
  cards: [],
};

export const validCardDeckForGuessTheImageGame = {
  title: "Card Title 81",
  theme: "Card Theme 81",
  cardType: "txtImg",
  frontSide: {
    text: [
      {
        content: "Texto1",
      },
    ],
  },
  backSide: {
    images: [
      {
        url: "https://www.adiosmascota.es/wp-content/uploads/2022/05/Alimentacion_correcta_de_un_loro.jpg",
      },
    ],
  },
};

export const validCard2DeckForGuessTheImageGame = {
  title: "Card Title 82",
  theme: "Card Theme 82",
  cardType: "txtImg",
  frontSide: {
    text: [
      {
        content: "Texto2",
      },
    ],
  },
  backSide: {
    images: [
      {
        url: "https://static.fundacion-affinity.org/cdn/farfuture/PVbbIC-0M9y4fPbbCsdvAD8bcjjtbFc0NSP3lRwlWcE/mtime:1643275542/sites/default/files/los-10-sonidos-principales-del-perro.jpg",
      },
    ],
  },
};

export const validCard3DeckForGuessTheImageGame = {
  title: "Card Title 83",
  theme: "Card Theme 83",
  cardType: "txtImg",
  frontSide: {
    text: [
      {
        content: "Texto3",
      },
    ],
  },
  backSide: {
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/6/64/Collage_of_Six_Cats-02.jpg",
      },
    ],
  },
};

export const validCard4DeckForGuessTheImageGame = {
  title: "Card Title 84",
  theme: "Card Theme 84",
  cardType: "txtImg",
  frontSide: {
    text: [
      {
        content: "Texto4",
      },
    ],
  },
  backSide: {
    images: [
      {
        url: "https://content.nationalgeographic.com.es/medio/2022/12/12/ballena-1_1b15f788_221212154535_1280x720.jpg",
      },
    ],
  },
};

export const validCard5DeckForGuessTheImageGame = {
  title: "Card Title 85",
  theme: "Card Theme 85",
  cardType: "txtImg",
  frontSide: {
    text: [
      {
        content: "Texto5",
      },
    ],
  },
  backSide: {
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Canis_lupus_265b.jpg/640px-Canis_lupus_265b.jpg",
      },
    ],
  },
};