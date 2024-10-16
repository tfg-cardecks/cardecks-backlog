export function generateWordSearchGrid(
  words: string[],
  gridSize: number = 10
): { grid?: string[][]; error?: string } {
  if (gridSize < 1) {
    return { error: "El tamaño de la cuadrícula debe ser al menos 1." };
  }

  const uniqueWords = Array.from(
    new Set(words.map((word) => word.toUpperCase()))
  );
  console.log(uniqueWords);
  const cleanedWords = uniqueWords
    .map((word) => cleanWord(word))
    .filter((word): word is string => word !== null);
  console.log(cleanedWords);
  const validWords = cleanedWords.filter((word) => word.length <= gridSize);
  console.log(validWords);
  if (validWords.length < 4) {
    return {
      error:
        "No hay suficientes palabras válidas para encajar en la cuadrícula. Por favor, añada cartas al mazo para poder crear un nuevo juego.",
    };
  }

  const selectedWords = getRandomWords(validWords, 4);

  const grid = initializeGrid(gridSize);
  const usedStartPositions = new Set<string>();

  selectedWords.forEach((word) => {
    if (!placeWordInGrid(word, grid, gridSize, usedStartPositions)) {
      return { error: `No se pudo colocar la palabra: ${word}` };
    }
  });

  fillEmptyCells(grid, gridSize);

  return { grid };
}

function cleanWord(word: string): string | null {
  const withoutSpaces = word.replace(/\s+/g, "");
  const withoutAccents = withoutSpaces
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const validWord = withoutAccents.replace(/[^A-Z]/gi, "");

  if (!/^[A-Z]+$/i.test(validWord) || validWord.length < 2) {
    return null;
  }

  return validWord.length > 0 ? validWord.toUpperCase() : null;
}

function getRandomWords(words: string[], count: number): string[] {
  const shuffled = words.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function initializeGrid(size: number): string[][] {
  return Array.from({ length: size }, () => Array(size).fill(""));
}

function placeWordInGrid(
  word: string,
  grid: string[][],
  gridSize: number,
  usedStartPositions: Set<string>
): boolean {
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
    [0, -1],
    [-1, 0],
    [-1, 1],
    [-1, -1],
  ];
  let placed = false;
  let attempts = 0;

  while (!placed && attempts < 100) {
    const direction = getRandomDirection(directions);
    const startRow = getRandomInt(0, gridSize - 1);
    const startCol = getRandomInt(0, gridSize - 1);
    const startPosition = `${startRow},${startCol}`;

    if (
      !usedStartPositions.has(startPosition) &&
      canPlaceWordInGrid(word, startRow, startCol, direction, grid, gridSize)
    ) {
      for (let i = 0; i < word.length; i++) {
        const newRow = startRow + i * direction[0];
        const newCol = startCol + i * direction[1];
        grid[newRow][newCol] = word[i];
      }
      usedStartPositions.add(startPosition);
      placed = true;
    }
    attempts++;
  }

  return placed;
}

function getRandomDirection(directions: number[][]): number[] {
  return directions[Math.floor(Math.random() * directions.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function canPlaceWordInGrid(
  word: string,
  row: number,
  col: number,
  direction: number[],
  grid: string[][],
  gridSize: number
): boolean {
  const endRow = row + (word.length - 1) * direction[0];
  const endCol = col + (word.length - 1) * direction[1];

  if (endRow < 0 || endRow >= gridSize || endCol < 0 || endCol >= gridSize) {
    return false;
  }

  for (let i = 0; i < word.length; i++) {
    const newRow = row + i * direction[0];
    const newCol = col + i * direction[1];
    if (grid[newRow][newCol] !== "" && grid[newRow][newCol] !== word[i]) {
      return false;
    }
  }
  return true;
}

function fillEmptyCells(grid: string[][], gridSize: number): void {
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (grid[i][j] === "") {
        grid[i][j] = getRandomLetter();
      }
    }
  }
}

function getRandomLetter(): string {
  return String.fromCharCode(65 + Math.floor(Math.random() * 26));
}
