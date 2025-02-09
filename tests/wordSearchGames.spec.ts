import request from "supertest";

//local imports
import { before, after } from "./utils/hooks";
import app from "../src/app";
import { API_BASE_URL, AUTH_BASE_URL } from "./utils/constants";
import { user } from "./utils/newUser";
import {
  validWordSearchGame,
  validWordSearchGame2,
  validDeckForWordSearchGame,
  validCardDeckForWordSearchGame,
  validCard2DeckForWordSearchGame,
  validCard3DeckForWordSearchGame,
  validCard4DeckForWordSearchGame,
  validCard5DeckForWordSearchGame,
} from "./utils/newWordSearchGame";

before;
after;

let token: string;
let deckId: string;
let gameId: string;
let wordSearchGameId: string;
let gameId2: string;
let wordSearchGameId2: string;
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
    .send(validCardDeckForWordSearchGame);
  cardId1 = responseCard.body._id;

  const responseCard2 = await request(app)
    .post(`${API_BASE_URL}/cards`)
    .set("Authorization", token)
    .send(validCard2DeckForWordSearchGame);
  cardId2 = responseCard2.body._id;

  const responseCard3 = await request(app)
    .post(`${API_BASE_URL}/cards`)
    .set("Authorization", token)
    .send(validCard3DeckForWordSearchGame);
  cardId3 = responseCard3.body._id;

  const responseCard4 = await request(app)
    .post(`${API_BASE_URL}/cards`)
    .set("Authorization", token)
    .send(validCard4DeckForWordSearchGame);
  cardId4 = responseCard4.body._id;

  const responseCard5 = await request(app)
    .post(`${API_BASE_URL}/cards`)
    .set("Authorization", token)
    .send(validCard5DeckForWordSearchGame);
  cardId5 = responseCard5.body._id;

  const responseDeck = await request(app)
    .post(`${API_BASE_URL}/decks`)
    .set("Authorization", token)
    .send({
      ...validDeckForWordSearchGame,
      cards: [cardId1, cardId2, cardId3, cardId4, cardId5],
    });

  deckId = responseDeck.body._id;

  const response2 = await request(app)
    .post(`${API_BASE_URL}/wordSearchGames`)
    .set("Authorization", token)
    .send({ ...validWordSearchGame, deckId });

  wordSearchGameId = response2.body.wordSearchGame._id;
  gameId = response2.body.game._id;

  const response3 = await request(app)
    .post(`${API_BASE_URL}/wordSearchGames`)
    .set("Authorization", token)
    .send({ ...validWordSearchGame2, deckId });

  wordSearchGameId2 = response3.body.wordSearchGame._id;
  gameId2 = response3.body.game._id;
});

describe("WordSearchGame API", () => {
  it("should get all word search games", async () => {
    const response = await request(app)
      .get(`${API_BASE_URL}/wordSearchGames`)
      .set("Authorization", token);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it("should get a word search game by ID", async () => {
    const response = await request(app)
      .get(`${API_BASE_URL}/wordSearchGame/${wordSearchGameId}`)
      .set("Authorization", token);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id", wordSearchGameId);
  });

  it("should return 404 for a non-existent word search game ID", async () => {
    const response = await request(app)
      .get(`${API_BASE_URL}/wordSearchGame/66fbe37b9d600a318c38ab12`)
      .set("Authorization", token);
    expect(response.status).toBe(404);
  });

  it("should return 500 for an invalid word search game ID", async () => {
    const response = await request(app)
      .get(`${API_BASE_URL}/wordSearchGame/invalidId`)
      .set("Authorization", token);
    expect(response.status).toBe(500);
  });

  it("should complete a word search game with all words found and finish the game", async () => {
    const foundWords = ["TEXTO1", "TEXTO2", "TEXTO3", "TEXTO4", "TEXTO5"];

    const response = await request(app)
      .post(`${API_BASE_URL}/currentWordSearchGame/${wordSearchGameId}`)
      .set("Authorization", token)
      .send({ foundWords });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("currentGame", 2);
    expect(response.body).toHaveProperty(
      "message",
      "¡Felicidades! Has completado las 1 partidas de WordSearchGame."
    );
    expect(response.body).toHaveProperty("totalGames", 1);
  }, 3000);

  it("should complete a word search game with all words found and pass to the next match", async () => {
    const foundWords = ["TEXTO1", "TEXTO2", "TEXTO3", "TEXTO4", "TEXTO5"];

    const response = await request(app)
      .post(`${API_BASE_URL}/currentWordSearchGame/${wordSearchGameId2}`)
      .set("Authorization", token)
      .send({ foundWords });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("currentGame", 2);
    expect(response.body).toHaveProperty("totalGames", 2);
    expect(response.body).toHaveProperty("gameId");
    expect(response.body.gameId).toHaveProperty("completed", false);
    expect(response.body.gameId).toHaveProperty("currentGameCount", 1);
    expect(response.body).toHaveProperty("wordSearchGameId");
  }, 3000);

  it("should force complete a word search game", async () => {
    const response = await request(app)
      .post(`${API_BASE_URL}/currentWordSearchGame/${wordSearchGameId}`)
      .set("Authorization", token)
      .send({ foundWords: ["WORD1", "WORD2"], forceComplete: true });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Juego completado forzosamente");
  });

  it("should delete a word search game by ID", async () => {
    const response = await request(app)
      .delete(`${API_BASE_URL}/wordSearchGame/${wordSearchGameId}`)
      .set("Authorization", token);
    expect(response.status).toBe(204);
  });

  it("should return 404 when deleting a non-existent word search game ID", async () => {
    const response = await request(app)
      .delete(`${API_BASE_URL}/wordSearchGame/66fbe37b9d600a318c38ab12`)
      .set("Authorization", token);
    expect(response.status).toBe(404);
  });

  it("should return an error for invalid settings (maxWords out of range)", async () => {
    const invalidSettings = {
      ...validWordSearchGame,
      settings: { ...validWordSearchGame.settings, maxWords: 5 },
    };
    const response = await request(app)
      .post(`${API_BASE_URL}/wordSearchGames`)
      .set("Authorization", token)
      .send({ ...invalidSettings, deckId });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "EL total de palabras debe estar entre 2 y 4"
    );
  });

  it("should return an error for invalid settings (totalGames out of range)", async () => {
    const invalidSettings = {
      ...validWordSearchGame,
      settings: { ...validWordSearchGame.settings, totalGames: 30 },
    };
    const response = await request(app)
      .post(`${API_BASE_URL}/wordSearchGames`)
      .set("Authorization", token)
      .send({ ...invalidSettings, deckId });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "El total de partidas debe ser máximo 25"
    );
  });

  it("should return 500 for getting a word search game with invalid ID format", async () => {
    const invalidId = "invalidIdFormat";
    const response = await request(app)
      .get(`${API_BASE_URL}/wordSearchGame/${invalidId}`)
      .set("Authorization", token);

    expect(response.status).toBe(500);
  });
});
