let usedWordsHistory: Set<string> = new Set();

export function generateWordSearchGrid(
  words: string[],
  gridSize: number = 10
): string[][] {
  if (gridSize < 1) {
    throw new Error("Grid size must be at least 1.");
  }

  // Verifica que las palabras no sean más largas que el tamaño de la cuadrícula
  const validateWords = (words: string[]): string[] => {
    return words.filter((word) => word.length <= gridSize);
  };

  const getRandomWords = (words: string[], numWords: number): string[] => {
    let availableWords = words.filter((word) => !usedWordsHistory.has(word));

    // Si no hay suficientes palabras disponibles, reinicia el historial
    if (availableWords.length < numWords) {
      usedWordsHistory.clear();
      availableWords = words;
    }

    // Mezcla las palabras disponibles
    const shuffled = availableWords.sort(() => 0.5 - Math.random());
    const selectedWords = shuffled.slice(0, numWords);
    selectedWords.forEach((word) => usedWordsHistory.add(word));
    return selectedWords;
  };

  // Filtra palabras que sean más grandes que el tamaño de la cuadrícula
  const validWords = validateWords(words);

  // Verifica que haya suficientes palabras válidas
  if (validWords.length < 3) {
    throw new Error("Not enough valid words to fit in the grid.");
  }

  // Selecciona un número aleatorio de palabras entre 3 y 5
  const numWords = Math.floor(Math.random() * 3) + 3; // Genera un número entre 3 y 5
  const selectedWords = getRandomWords(validWords, numWords);

  // Crea una cuadrícula vacía
  const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(""));

  const placeWord = (word: string) => {
    const directions = [
      [0, 1], // Derecha
      [1, 0], // Abajo
      [1, 1], // Diagonal abajo-derecha
      [-1, 1], // Diagonal arriba-derecha
    ];
    let placed = false;

    while (!placed) {
      const direction =
        directions[Math.floor(Math.random() * directions.length)];
      const startRow = Math.floor(Math.random() * gridSize);
      const startCol = Math.floor(Math.random() * gridSize);

      if (canPlaceWord(word, startRow, startCol, direction, grid)) {
        for (let i = 0; i < word.length; i++) {
          const newRow = startRow + i * direction[0];
          const newCol = startCol + i * direction[1];
          grid[newRow][newCol] = word[i];
        }
        placed = true;
      }
    }
  };

  const canPlaceWord = (
    word: string,
    row: number,
    col: number,
    direction: number[],
    grid: string[][]
  ): boolean => {
    for (let i = 0; i < word.length; i++) {
      const newRow = row + i * direction[0];
      const newCol = col + i * direction[1];
      if (
        newRow < 0 ||
        newRow >= gridSize ||
        newCol < 0 ||
        newCol >= gridSize ||
        (grid[newRow][newCol] !== "" && grid[newRow][newCol] !== word[i])
      ) {
        return false;
      }
    }
    return true;
  };

  // Coloca las palabras seleccionadas en la cuadrícula
  selectedWords.forEach((word) => placeWord(word));

  // Llena los espacios vacíos con letras aleatorias
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (grid[i][j] === "") {
        grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // Letras aleatorias de A-Z
      }
    }
  }

  return grid;
}
