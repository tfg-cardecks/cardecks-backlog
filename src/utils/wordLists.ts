// Define the type for the themes
export type Theme = "Animals" | "Colors";

// Define the type for the word lists
export type WordLists = {
  [key in Theme]: string[];
};

export const wordLists: WordLists = {
  Animals: [
    "lion",
    "tiger",
    "bear",
    "wolf",
    "eagle",
    "shark",
    "whale",
    "panda",
    "zebra",
    "giraffe",
    "monkey",
    "elephant",
    "rhino",
  ],
  Colors: [
    "red",
    "blue",
    "green",
    "yellow",
    "purple",
    "orange",
    "pink",
    "brown",
    "black",
    "white",
  ],
};