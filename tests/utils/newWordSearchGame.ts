// Datos válidos para un juego de sopa de letras
export const validWordSearchGame = {
  _id: "66fdc230edf080aa5810c6d4",
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
    ["M", "N", "O", "P", "Q", "R", "S", "T", "U", "V"]
  ],
  words: ["WORD1", "WORD2", "WORD3", "WORD4"],
  status: "completed",
  foundWords: ["WORD1", "WORD2", "WORD3", "WORD4"],
  timeTaken: 0,
  completed: true,
  __v: 1
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
      ["M", "N", "O", "P", "Q", "R", "S", "T", "U", "V"]
    ],
    words: ["WORD1", "WORD2", "WORD3", "WORD4"],
    status: "completed",
    foundWords: ["WORD1", "WORD2", "WORD3", "WORD4"],
    timeTaken: 0,
    completed: true,
    __v: 1
  },
  // Tipos de datos incorrectos
  {
    _id: "66fdc230edf080aa5810c6d4",
    game: "66fdc22fedf080aa5810c6c1",
    user: "66fbdb519d600a318c38aa6c",
    deck: "66fbe3299d600a318c38aaed",
    grid: "not an array",  // Se espera un array, pero se proporciona una cadena
    words: "not an array",  // Se espera un array, pero se proporciona una cadena
    status: 123,  // Se espera una cadena, pero se proporciona un número
    foundWords: "not an array",  // Se espera un array, pero se proporciona una cadena
    timeTaken: "zero",  // Se espera un número, pero se proporciona una cadena
    completed: "yes",  // Se espera un booleano, pero se proporciona una cadena
    __v: "one"  // Se espera un número, pero se proporciona una cadena
  },
  // Valores fuera de los límites permitidos
  {
    _id: "66fdc230edf080aa5810c6d4",
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
      ["M", "N", "O", "P", "Q", "R", "S", "T", "U", "V"]
    ],
    words: ["WORD1", "WORD2", "WORD3", "WORD4"],
    status: "completed",
    foundWords: ["WORD1", "WORD2", "WORD3", "WORD4"],
    timeTaken: -1,  // Valor fuera de los límites permitidos
    completed: true,
    __v: 1
  }
];