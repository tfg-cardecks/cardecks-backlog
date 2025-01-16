import request from "supertest";

// local imports
import { before, after } from "./utils/hooks";
import app from "../src/app";
import { API_BASE_URL, AUTH_BASE_URL } from "./utils/constants";
import { user } from "./utils/newUser";
import {
  validCardDeckForMatchingGame,
  validCard2DeckForMatchingGame,
  validCard3DeckForMatchingGame,
  validCard4DeckForMatchingGame,
  validCard5DeckForMatchingGame,
  validCard6DeckForMatchingGame,
  validCard7DeckForMatchingGame,
  validCard8DeckForMatchingGame,
  validCard9DeckForMatchingGame,
  validCard10DeckForMatchingGame,
  validDeckForMatchingGame,
  validMatchingGame,
  invalidMatchingGames,
} from "./utils/newMatchingGames";

before;
after;

let token: string;
let deckId: string;
let gameId: string;
let matchingGameId: string;
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
let cardId10: string;

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
    .send(validCardDeckForMatchingGame);
  cardId1 = responseCard.body._id;

  const responseCard2 = await request(app)
    .post(`${API_BASE_URL}/cards`)
    .set("Authorization", token)
    .send(validCard2DeckForMatchingGame);
  cardId2 = responseCard2.body._id;

  const responseCard3 = await request(app)
    .post(`${API_BASE_URL}/cards`)
    .set("Authorization", token)
    .send(validCard3DeckForMatchingGame);
  cardId3 = responseCard3.body._id;

  const responseCard4 = await request(app)
    .post(`${API_BASE_URL}/cards`)
    .set("Authorization", token)
    .send(validCard4DeckForMatchingGame);
  cardId4 = responseCard4.body._id;

  const responseCard5 = await request(app)
    .post(`${API_BASE_URL}/cards`)
    .set("Authorization", token)
    .send(validCard5DeckForMatchingGame);
  cardId5 = responseCard5.body._id;

  const responseCard6 = await request(app)
    .post(`${API_BASE_URL}/cards`)
    .set("Authorization", token)
    .send(validCard6DeckForMatchingGame);
  cardId6 = responseCard6.body._id;

  const responseCard7 = await request(app)
    .post(`${API_BASE_URL}/cards`)
    .set("Authorization", token)
    .send(validCard7DeckForMatchingGame);
  cardId7 = responseCard7.body._id;

  const responseCard8 = await request(app)
    .post(`${API_BASE_URL}/cards`)
    .set("Authorization", token)
    .send(validCard8DeckForMatchingGame);
  cardId8 = responseCard8.body._id;

  const responseCard9 = await request(app)
    .post(`${API_BASE_URL}/cards`)
    .set("Authorization", token)
    .send(validCard9DeckForMatchingGame);
  cardId9 = responseCard9.body._id;

  const responseCard10 = await request(app)
    .post(`${API_BASE_URL}/cards`)
    .set("Authorization", token)
    .send(validCard10DeckForMatchingGame);
  cardId10 = responseCard10.body._id;

  const responseDeck = await request(app)
    .post(`${API_BASE_URL}/decks`)
    .set("Authorization", token)
    .send({
      ...validDeckForMatchingGame,
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
        cardId10,
      ],
    });

  deckId = responseDeck.body._id;

  const response2 = await request(app)
    .post(`${API_BASE_URL}/matchingGames`)
    .set("Authorization", token)
    .send({ ...validMatchingGame, deckId });

  matchingGameId = response2.body.matchingGame._id;
  gameId = response2.body.game._id;
});

describe("MatchingGame API", () => {
  it("should get all matching games", async () => {
    const response = await request(app)
      .get(`${API_BASE_URL}/matchingGames`)
      .set("Authorization", token);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it("should get a matching game by ID", async () => {
    const response = await request(app)
      .get(`${API_BASE_URL}/matchingGame/${matchingGameId}`)
      .set("Authorization", token);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id", matchingGameId);
  });

  it("should return 404 for a non-existent matching game ID", async () => {
    const response = await request(app)
      .get(`${API_BASE_URL}/matchingGame/66fbe37b9d600a318c38ab12`)
      .set("Authorization", token);
    expect(response.status).toBe(404);
  });

  it("should return 500 for an invalid matching game ID", async () => {
    const response = await request(app)
      .get(`${API_BASE_URL}/matchingGame/invalidId`)
      .set("Authorization", token);
    expect(response.status).toBe(500);
  });

  it("should complete a matching game with correct answers", async () => {
    const selectedAnswer = {
      KIKO: "Texto de ejemplo en la parte trasera KIKO",
      PATO: "Texto de ejemplo en la parte trasera PATO",
      FAISAN: "Texto de ejemplo en la parte trasera FAISAN",
      GATO: "Texto de ejemplo en la parte trasera GATO",
      LILIL: "Texto de ejemplo en la parte trasera LILIL",
      PERRO: "Texto de ejemplo en la parte trasera PERRO",
      CABALLO: "Texto de ejemplo en la parte trasera CABALLO",
      ELEFANTE: "Texto de ejemplo en la parte trasera ELEFANTE",
      TIGRE: "Texto de ejemplo en la parte trasera TIGRE",
      LEON: "Texto de ejemplo en la parte trasera LEON"
    };

    const response = await request(app)
      .post(`${API_BASE_URL}/currentMatchingGame/${matchingGameId}`)
      .set("Authorization", token)
      .send({
        selectedAnswer,
        countAsCompleted: true,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("gameId");
    expect(response.body).toHaveProperty("matchingGameId");
  }, 3000);

  it("should force complete a matching game", async () => {
    const selectedAnswer = {
      KIKO: "Texto de ejemplo en la parte trasera KIKO",
    };

    const response = await request(app)
      .post(`${API_BASE_URL}/currentMatchingGame/${matchingGameId}`)
      .set("Authorization", token)
      .send({
        selectedAnswer,
        forceComplete: true,
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Juego completado forzosamente");
  });

  it("should complete a matching game with no answers", async () => {
    const selectedAnswer: Record<string, string> = {};

    const response = await request(app)
      .post(`${API_BASE_URL}/currentMatchingGame/${matchingGameId}`)
      .set("Authorization", token)
      .send({
        selectedAnswer,
        countAsCompleted: true,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("gameId");
    expect(response.body).toHaveProperty("matchingGameId");
  });

  it("should delete a matching game by ID", async () => {
    const response = await request(app)
      .delete(`${API_BASE_URL}/matchingGame/${matchingGameId}`)
      .set("Authorization", token);
    expect(response.status).toBe(204);
  });

  it("should return 404 when deleting a non-existent matching game ID", async () => {
    const response = await request(app)
      .delete(`${API_BASE_URL}/matchingGame/66fbe37b9d600a318c38ab12`)
      .set("Authorization", token);
    expect(response.status).toBe(404);
  });

  it("should create a new matching game", async () => {
    const response = await request(app)
      .post(`${API_BASE_URL}/matchingGames`)
      .set("Authorization", token)
      .send({ ...validMatchingGame, deckId });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message", "Juego creado con éxito");
    expect(response.body).toHaveProperty("game");
    expect(response.body).toHaveProperty("matchingGame");
  });

  it("should return 500 for getting a matching game with invalid ID format", async () => {
    const invalidId = "invalidIdFormat";
    const response = await request(app)
      .get(`${API_BASE_URL}/matchingGame/${invalidId}`)
      .set("Authorization", token);

    expect(response.status).toBe(500);
  });
});