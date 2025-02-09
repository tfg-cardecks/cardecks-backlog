// Datos válidos para un juego de adivinar la imagen
export const validLetterOrderGame = {
  settings: {
    totalGames: 1,
    duration: 60,
    numWords: 3,
  },
};

// Datos válidos para un juego de adivinar la imagen
export const validLetterOrderGame2 = {
  settings: {
    totalGames: 2,
    duration: 60,
    numWords: 3,
  },
};

// Datos inválidos para un juego de Ordenar Letras
export const invalidLetterOrderGames = [
  // Faltan campos obligatorios
  {
    game: "66fdc22fedf080aa5810c6c1",
    user: "66fbdb519d600a318c38aa6c",
    deck: "66fbe3299d600a318c38aaed",
    words: [
      {
        grid: ["S", "A", "E", "K", "T"],
        word: "SKATE",
        foundLetters: [],
        status: "inProgress",
      },
    ],
    numWords: 3,
    duration: 60,
    status: "inProgress",
  },
  // Tipos de datos incorrectos
  {
    game: "66fdc22fedf080aa5810c6c1",
    user: "66fbdb519d600a318c38aa6c",
    deck: "66fbe3299d600a318c38aaed",
    words: "not an array", // should be an array
    numWords: "three", // should be a number
    duration: "sixty", // should be a number
    status: 123, // should be a string
  },
  // Otro conjunto de datos inválidos
  {
    game: "66fdc22fedf080aa5810c6c1",
    user: "66fbdb519d600a318c38aa6c",
    deck: "66fbe3299d600a318c38aaed",
    words: [
      {
        grid: ["C", "R", "T", "T", "A", "O", "R"],
        word: "TRACTOR",
        foundLetters: [],
        status: "inProgress",
      },
    ],
    numWords: 3,
    duration: 60,
    status: "inProgress",
  },
];

export const validDeckForLetterOrderGame = {
  name: "Deck Name 3",
  description: "This is a deck description. 3",
  theme: "Deck Theme 3",
  cards: [],
};

export const validCardDeckForLetterOrderGame = {
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

export const validCardDeckForLetterOrderGame2 = {
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

export const validCardDeckForLetterOrderGame3 = {
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

export const validCardDeckForLetterOrderGame4 = {
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

export const validCardDeckForLetterOrderGame5 = {
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

export const validCardDeckForLetterOrderGame6 = {
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

export const validCardDeckForLetterOrderGame7 = {
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

export const validCardDeckForLetterOrderGame8 = {
  title: "Card Title 39",
  theme: "Card Theme 39",
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

export const validCardDeckForLetterOrderGame9 = {
  title: "Card Title 40",
  theme: "Card Theme 40",
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
