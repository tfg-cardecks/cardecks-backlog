import request from "supertest";

//local imports
import { before, after } from "./utils/hooks";
import app from "../src/app";
import { API_BASE_URL, AUTH_BASE_URL } from "./utils/constants";
import { user } from "./utils/newUser";
import {
  validLetterOrderGame,
  invalidLetterOrderGames,
  validDeckForLetterOrderGame,
  validCardDeckForLetterOrderGame,
  validCardDeckForLetterOrderGame2,
  validCardDeckForLetterOrderGame3,
  validCardDeckForLetterOrderGame4,
  validCardDeckForLetterOrderGame5,
  validCardDeckForLetterOrderGame6,
  validCardDeckForLetterOrderGame7,
  validCardDeckForLetterOrderGame8,
  validCardDeckForLetterOrderGame9,
} from "./utils/newLetterOrderGame";

before;
after;

let token: string;
let deckId: string;
let gameId: string;
let letterOrderGameId: string;
let userId: string;
let cardId1: string;
let cardId2: string;
let cardId3: string;
let cardId4: string;
let cardId5: string;
let cardId6: string;
let cardId7: string;
let cardId8: string;
let cardId9: string;

beforeAll(async () => {
  await request(app).post(`${AUTH_BASE_URL}/signup`).send(user);

  const response = await request(app)
    .post(`${AUTH_BASE_URL}/signin`)
    .send({ emailOrUsername: user.username, password: user.password });

  token = response.body.token;
  userId = response.body.id;

  const responseCard1 = await request(app)
    .post(`${API_BASE_URL}/cards`)
    .set("Authorization", token)
    .send(validCardDeckForLetterOrderGame);
  cardId1 = responseCard1.body._id;

  const responseCard2 = await request(app)
    .post(`${API_BASE_URL}/cards`)
    .set("Authorization", token)
    .send(validCardDeckForLetterOrderGame2);
  cardId2 = responseCard2.body._id;

  const responseCard3 = await request(app)
    .post(`${API_BASE_URL}/cards`)
    .set("Authorization", token)
    .send(validCardDeckForLetterOrderGame3);
  cardId3 = responseCard3.body._id;

  const responseCard4 = await request(app)
    .post(`${API_BASE_URL}/cards`)
    .set("Authorization", token)
    .send(validCardDeckForLetterOrderGame4);
  cardId4 = responseCard4.body._id;

  const responseCard5 = await request(app)
    .post(`${API_BASE_URL}/cards`)
    .set("Authorization", token)
    .send(validCardDeckForLetterOrderGame5);
  cardId5 = responseCard5.body._id;

  const responseCard6 = await request(app)
    .post(`${API_BASE_URL}/cards`)
    .set("Authorization", token)
    .send(validCardDeckForLetterOrderGame6);
  cardId6 = responseCard6.body._id;

  const responseCard7 = await request(app)
    .post(`${API_BASE_URL}/cards`)
    .set("Authorization", token)
    .send(validCardDeckForLetterOrderGame7);
  cardId7 = responseCard7.body._id;

  const responseCard8 = await request(app)
    .post(`${API_BASE_URL}/cards`)
    .set("Authorization", token)
    .send(validCardDeckForLetterOrderGame8);
  cardId8 = responseCard8.body._id;

  const responseCard9 = await request(app)
    .post(`${API_BASE_URL}/cards`)
    .set("Authorization", token)
    .send(validCardDeckForLetterOrderGame9);
  cardId9 = responseCard9.body._id;

  const responseDeck = await request(app)
    .post(`${API_BASE_URL}/decks`)
    .set("Authorization", token)
    .send({
      ...validDeckForLetterOrderGame,
      cards: [
        cardId1,
        cardId2,
        cardId3,
        cardId4,
        cardId5,
        cardId6,
        cardId7,
        cardId8,
        cardId9,
      ],
    });

  deckId = responseDeck.body._id;

  const response2 = await request(app)
    .post(`${API_BASE_URL}/letterOrderGames`)
    .set("Authorization", token)
    .send({ ...validLetterOrderGame, deckId });

  letterOrderGameId = response2.body.letterOrderGame._id;
  gameId = response2.body.game._id;
});

describe("LetterOrderGame API", () => {
  it("should get all letter order games", async () => {
    const response = await request(app)
      .get(`${API_BASE_URL}/letterOrderGames`)
      .set("Authorization", token);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it("should get a letter order game by ID", async () => {
    const response = await request(app)
      .get(`${API_BASE_URL}/letterOrderGame/${letterOrderGameId}`)
      .set("Authorization", token);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id", letterOrderGameId);
  });

  it("should return 404 for a non-existent letter order game ID", async () => {
    const response = await request(app)
      .get(`${API_BASE_URL}/letterOrderGame/60d5ec49f9a1b34d4c8e4b8a`)
      .set("Authorization", token);
    expect(response.status).toBe(404);
  });

  it("should return 500 for an invalid letter order game ID", async () => {
    const response = await request(app)
      .get(`${API_BASE_URL}/letterOrderGame/invalidId`)
      .set("Authorization", token);
    expect(response.status).toBe(500);
  });

  it("should create a valid letter order game", async () => {
    const response = await request(app)
      .post(`${API_BASE_URL}/letterOrderGames`)
      .set("Authorization", token)
      .send({
        deckId: deckId,
        settings: validLetterOrderGame.settings,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message", "Juego creado con éxito");
    expect(response.body).toHaveProperty("game");
    expect(response.body).toHaveProperty("letterOrderGame");
  });

  it("should return 400 for invalid letter order game data", async () => {
    for (const invalidData of invalidLetterOrderGames) {
      const response = await request(app)
        .post(`${API_BASE_URL}/letterOrderGames`)
        .set("Authorization", token)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
    }
  });

  it("should complete a letter order game", async () => {
    const response = await request(app)
      .post(`${API_BASE_URL}/currentLetterOrderGame/${letterOrderGameId}`)
      .set("Authorization", token)
      .send({ countAsCompleted: true, forceComplete: false });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
  });

  it("should delete a letter order game by ID", async () => {
    const response = await request(app)
      .delete(`${API_BASE_URL}/letterOrderGame/${letterOrderGameId}`)
      .set("Authorization", token);
    expect(response.status).toBe(204);
  });

  it("should return 404 when deleting a non-existent letter order game ID", async () => {
    const response = await request(app)
      .delete(`${API_BASE_URL}/letterOrderGames/60d5ec49f9a1b34d4c8e4b8a`)
      .set("Authorization", token);
    expect(response.status).toBe(404);
  });
});
