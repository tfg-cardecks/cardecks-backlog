let usedWordsHistory: Set<string> = new Set();

export function generateWordSearchGrid(
  words: string[],
  gridSize: number = 10
): string[][] {
  if (gridSize < 1) {
    throw new Error("El tamaño de la cuadrícula debe ser al menos 1.");
  }

  const validWords = filterValidWords(words, gridSize);

  if (validWords.length < 3)
    throw new Error("No hay suficientes palabras válidas para encajar en la cuadrícula.");

  const numWords = getRandomInt(3, 5);
  const selectedWords = selectRandomWords(validWords, numWords);
  const grid = initializeGrid(gridSize);

  selectedWords.forEach((word) => placeWordInGrid(word, grid, gridSize));
  fillEmptyCells(grid, gridSize);

  return grid;
}

function filterValidWords(words: string[], gridSize: number): string[] {
  return words.filter((word) => word.length <= gridSize);
}

function selectRandomWords(words: string[], numWords: number): string[] {
  let availableWords = words.filter((word) => !usedWordsHistory.has(word));

  if (availableWords.length < numWords) {
    usedWordsHistory.clear();
    availableWords = words;
  }

  const shuffled = availableWords.sort(() => 0.5 - Math.random());
  const selectedWords = shuffled.slice(0, numWords);
  selectedWords.forEach((word) => usedWordsHistory.add(word));
  return selectedWords;
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function initializeGrid(size: number): string[][] {
  return Array.from({ length: size }, () => Array(size).fill(""));
}

function placeWordInGrid(
  word: string,
  grid: string[][],
  gridSize: number
): void {
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [-1, 1],
  ];
  let placed = false;

  while (!placed) {
    const direction = getRandomDirection(directions);
    const startRow = getRandomInt(0, gridSize - 1);
    const startCol = getRandomInt(0, gridSize - 1);

    if (
      canPlaceWordInGrid(word, startRow, startCol, direction, grid, gridSize)
    ) {
      for (let i = 0; i < word.length; i++) {
        const newRow = startRow + i * direction[0];
        const newCol = startCol + i * direction[1];
        grid[newRow][newCol] = word[i];
      }
      placed = true;
    }
  }
}

function getRandomDirection(directions: number[][]): number[] {
  return directions[Math.floor(Math.random() * directions.length)];
}

function canPlaceWordInGrid(
  word: string,
  row: number,
  col: number,
  direction: number[],
  grid: string[][],
  gridSize: number
): boolean {
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