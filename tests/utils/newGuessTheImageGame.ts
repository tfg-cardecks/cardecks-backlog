// Datos válidos para un juego de adivinar la imagen
export const validGuessTheImageGame = {
  settings: {
    totalGames: 1,
    duration: 60,
  },
};

// Datos válidos para un juego de adivinar la imagen con 2 totalGames
export const validGuessTheImageGame2 = {
  settings: {
    totalGames: 2,
    duration: 60,
  },
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
  },
  // Otro conjunto de datos inválidos
  {
    game: "66fdc22fedf080aa5810c6c1",
    user: "66fbdb519d600a318c38aa6c",
    deck: "66fbe3299d600a318c38aaed",
    image: "https://example.com/image.jpg",
    options: ["OPTION1", "OPTION2", "OPTION3", "OPTION4"],
    correctAnswer: "OPTION1",
    status: "completed",
    selectedAnswer: "OPTION1",
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
        content: "Arbol",
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
        content: "Nubes",
      },
    ],
  },
  backSide: {
    images: [
      {
        url: "https://es.mypet.com/wp-content/uploads/sites/23/2021/03/GettyImages-1143107320-e1597136744606.jpg",
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
        content: "Nubosa",
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
        content: "Cascada",
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
        content: "Lluvia",
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
