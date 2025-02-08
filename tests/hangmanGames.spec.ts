import request from "supertest";

//local imports
import { before, after } from "./utils/hooks";
import app from "../src/app";
import { API_BASE_URL, AUTH_BASE_URL } from "./utils/constants";
import { user } from "./utils/newUser";
import {
  validCardDeckForHangmanGame,
  validCard2DeckForHangmanGame,
  validCard3DeckForHangmanGame,
  validCard4DeckForHangmanGame,
  validCard5DeckForHangmanGame,
  validDeckForHangmanGame,
  validHangmanGame,
  invalidHangmanGames,
} from "./utils/newHangmanGame";

before;
after;

let token: string;
let deckId: string;
let gameId: string;
let hangmanGameId: string;
let userId: string;
let cardId1: string;
let cardId2: string;
let cardId3: string;
let cardId4: string;
let cardId5: string;

beforeAll(async () => {
  await request(app).post(`${AUTH_BASE_URL}/signup`).send(user);

  const response = await request(app)
    .post(`${AUTH_BASE_URL}/signin`)
    .send({ emailOrUsername: user.username, password: user.password });

  token = response.body.token;
  userId = response.body.id;

  const responseCard = await request(app)
    .post(`${API_BASE_URL}/cards`)
    .set("Authorization", token)
    .send(validCardDeckForHangmanGame);
  cardId1 = responseCard.body._id;

  const responseCard2 = await request(app)
    .post(`${API_BASE_URL}/cards`)
    .set("Authorization", token)
    .send(validCard2DeckForHangmanGame);
  cardId2 = responseCard2.body._id;

  const responseCard3 = await request(app)
    .post(`${API_BASE_URL}/cards`)
    .set("Authorization", token)
    .send(validCard3DeckForHangmanGame);
  cardId3 = responseCard3.body._id;

  const responseCard4 = await request(app)
    .post(`${API_BASE_URL}/cards`)
    .set("Authorization", token)
    .send(validCard4DeckForHangmanGame);
  cardId4 = responseCard4.body._id;

  const responseCard5 = await request(app)
    .post(`${API_BASE_URL}/cards`)
    .set("Authorization", token)
    .send(validCard5DeckForHangmanGame);
  cardId5 = responseCard5.body._id;

  const responseDeck = await request(app)
    .post(`${API_BASE_URL}/decks`)
    .set("Authorization", token)
    .send({
      ...validDeckForHangmanGame,
      cards: [cardId1, cardId2, cardId3, cardId4, cardId5],
    });

  deckId = responseDeck.body._id;

  const response2 = await request(app)
    .post(`${API_BASE_URL}/hangmanGames`)
    .set("Authorization", token)
    .send({ ...validHangmanGame, deckId });

  hangmanGameId = response2.body.hangmanGame._id;
  gameId = response2.body.game._id;
});

describe("HangmanGame API", () => {
  it("should get all hangman games", async () => {
    const response = await request(app)
      .get(`${API_BASE_URL}/hangmanGames`)
      .set("Authorization", token);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it("should get a hangman game by ID", async () => {
    const response = await request(app)
      .get(`${API_BASE_URL}/hangmanGame/${hangmanGameId}`)
      .set("Authorization", token);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id", hangmanGameId);
  });

  it("should return 404 for a non-existent hangman game ID", async () => {
    const response = await request(app)
      .get(`${API_BASE_URL}/hangmanGame/66fbe37b9d600a318c38ab12`)
      .set("Authorization", token);
    expect(response.status).toBe(404);
  });

  it("should return 500 for an invalid hangman game ID", async () => {
    const response = await request(app)
      .get(`${API_BASE_URL}/hangmanGame/invalidId`)
      .set("Authorization", token);
    expect(response.status).toBe(500);
  });

  it("should complete a hangman game with all letters found", async () => {
    const guessedLetters = [
      "K",
      "I",
      "K",
      "O",
      "P",
      "A",
      "T",
      "O",
      "F",
      "A",
      "I",
      "S",
      "A",
      "N",
      "G",
      "A",
      "T",
      "O",
      "L",
      "I",
      "L",
      "I",
      "L",
    ];

    const response = await request(app)
      .post(`${API_BASE_URL}/currentHangmanGame/${hangmanGameId}`)
      .set("Authorization", token)
      .send({
        guessedLetters,
        wrongLetters: [],
        countAsCompleted: true,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("currentGame", 2);
    expect(response.body).toHaveProperty("message", "¡Felicidades! Has completado las 1 partidas de HangmanGame.");
    expect(response.body).toHaveProperty("totalGames", 1);
  }, 3000);

  it("should force complete a hangman game", async () => {
    const response = await request(app)
      .post(`${API_BASE_URL}/currentHangmanGame/${hangmanGameId}`)
      .set("Authorization", token)
      .send({
        guessedLetters: ["K", "I"],
        wrongLetters: [],
        forceComplete: true,
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Juego completado forzosamente");
  });

  it("should complete a hangman game with no letters found", async () => {
    const guessedLetters: string[] = [];

    const response = await request(app)
      .post(`${API_BASE_URL}/currentHangmanGame/${hangmanGameId}`)
      .set("Authorization", token)
      .send({
        guessedLetters,
        wrongLetters: [],
        countAsCompleted: true,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("currentGame", 3);
    expect(response.body).toHaveProperty("message", "¡Felicidades! Has completado las 1 partidas de HangmanGame.");
    expect(response.body).toHaveProperty("totalGames", 1);
  });


  it("should delete a hangman game by ID", async () => {
    const response = await request(app)
      .delete(`${API_BASE_URL}/hangmanGame/${hangmanGameId}`)
      .set("Authorization", token);
    expect(response.status).toBe(204);
  });

  it("should return 404 when deleting a non-existent hangman game ID", async () => {
    const response = await request(app)
      .delete(`${API_BASE_URL}/hangmanGame/66fbe37b9d600a318c38ab12`)
      .set("Authorization", token);
    expect(response.status).toBe(404);
  });

  it("should create a new hangman game", async () => {
    const response = await request(app)
      .post(`${API_BASE_URL}/hangmanGames`)
      .set("Authorization", token)
      .send({ ...validHangmanGame, deckId });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message", "Juego creado con éxito");
    expect(response.body).toHaveProperty("game");
    expect(response.body).toHaveProperty("hangmanGame");
  });

  it("should return 500 for getting a hangman game with invalid ID format", async () => {
    const invalidId = "invalidIdFormat";
    const response = await request(app)
      .get(`${API_BASE_URL}/hangmanGame/${invalidId}`)
      .set("Authorization", token);

    expect(response.status).toBe(500);
  });
});
