import request from "supertest";

//local imports
import { before, after } from "./utils/hooks";
import app from "../src/app";
import { API_BASE_URL, AUTH_BASE_URL } from "./utils/constants";
import { user } from "./utils/newUser";
import {
  validGuessTheImageGame,
  validDeckForGuessTheImageGame,
  validCardDeckForGuessTheImageGame,
  validCard2DeckForGuessTheImageGame,
  validCard3DeckForGuessTheImageGame,
  validCard4DeckForGuessTheImageGame,
  validCard5DeckForGuessTheImageGame,
} from "./utils/newGuessTheImageGame";

before;
after;

let token: string;
let deckId: string;
let gameId: string;
let guessTheImageGameId: string;
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
    .send(validCardDeckForGuessTheImageGame);
  cardId1 = responseCard.body._id;

  const responseCard2 = await request(app)
    .post(`${API_BASE_URL}/cards`)
    .set("Authorization", token)
    .send(validCard2DeckForGuessTheImageGame);
  cardId2 = responseCard2.body._id;

  const responseCard3 = await request(app)
    .post(`${API_BASE_URL}/cards`)
    .set("Authorization", token)
    .send(validCard3DeckForGuessTheImageGame);
  cardId3 = responseCard3.body._id;

  const responseCard4 = await request(app)
    .post(`${API_BASE_URL}/cards`)
    .set("Authorization", token)
    .send(validCard4DeckForGuessTheImageGame);
  cardId4 = responseCard4.body._id;

  const responseCard5 = await request(app)
    .post(`${API_BASE_URL}/cards`)
    .set("Authorization", token)
    .send(validCard5DeckForGuessTheImageGame);
  cardId5 = responseCard5.body._id;

  const responseDeck = await request(app)
    .post(`${API_BASE_URL}/decks`)
    .set("Authorization", token)
    .send({
      ...validDeckForGuessTheImageGame,
      cards: [cardId1, cardId2, cardId3, cardId4, cardId5],
    });

  deckId = responseDeck.body._id;

  const response2 = await request(app)
    .post(`${API_BASE_URL}/guessTheImageGames`)
    .set("Authorization", token)
    .send({ ...validGuessTheImageGame, deckId });

  guessTheImageGameId = response2.body.guessTheImageGameId;
  gameId = response2.body.gameId;
});

describe("GuessTheImageGame API", () => {
  it("should get all guess the image games", async () => {
    const response = await request(app)
      .get(`${API_BASE_URL}/guessTheImageGames`)
      .set("Authorization", token);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it("should return a message indicating a guess the image game is already in progress", async () => {
    const response = await request(app)
      .post(`${API_BASE_URL}/guessTheImageGames`)
      .set("Authorization", token)
      .send({ deckId });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "Ya tienes un Juego de Adivinar la Imagen en progreso"
    );
  });

  it("should get a guess the image game by ID", async () => {
    const response = await request(app)
      .get(`${API_BASE_URL}/guessTheImageGame/${guessTheImageGameId}`)
      .set("Authorization", token);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id", guessTheImageGameId);
  });

  it("should return 404 for a non-existent guess the image game ID", async () => {
    const response = await request(app)
      .get(`${API_BASE_URL}/guessTheImageGame/66fbe37b9d600a318c38ab12`)
      .set("Authorization", token);
    expect(response.status).toBe(404);
  });

  it("should return 500 for an invalid guess the image game ID", async () => {
    const response = await request(app)
      .get(`${API_BASE_URL}/guessTheImageGame/invalidId`)
      .set("Authorization", token);
    expect(response.status).toBe(500);
  });

  it("should complete a guess the image game with the correct answer", async () => {
    const gameResponse = await request(app)
      .get(`${API_BASE_URL}/guessTheImageGame/${guessTheImageGameId}`)
      .set("Authorization", token);

    const correctAnswer = gameResponse.body.correctAnswer;

    const response = await request(app)
      .post(`${API_BASE_URL}/currentGuessTheImageGame/${guessTheImageGameId}`)
      .set("Authorization", token)
      .send({ selectedAnswer: correctAnswer, timeTaken: 10 });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("gameId");
    expect(response.body).toHaveProperty("guessTheImageGameId");
  }, 3000);

  it("should return an error when the answer is incorrect", async () => {
    const response = await request(app)
      .post(`${API_BASE_URL}/currentGuessTheImageGame/${guessTheImageGameId}`)
      .set("Authorization", token)
      .send({ selectedAnswer: "WRONG_ANSWER", timeTaken: 10 });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "La respuesta debe ser correcta o el usuario debe elegir terminar el juego antes de completarlo"
    );
  });

  it("should force complete a guess the image game", async () => {
    const response = await request(app)
      .post(`${API_BASE_URL}/currentGuessTheImageGame/${guessTheImageGameId}`)
      .set("Authorization", token)
      .send({
        selectedAnswer: "WRONG_ANSWER",
        forceComplete: true,
        timeTaken: 10,
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Juego completado forzosamente");
  });

  it("should delete a guess the image game by ID", async () => {
    const response = await request(app)
      .delete(`${API_BASE_URL}/guessTheImageGame/${guessTheImageGameId}`)
      .set("Authorization", token);
    expect(response.status).toBe(204);
  });

  it("should return 404 when deleting a non-existent guess the image game ID", async () => {
    const response = await request(app)
      .delete(`${API_BASE_URL}/guessTheImageGame/66fbe37b9d600a318c38ab12`)
      .set("Authorization", token);
    expect(response.status).toBe(404);
  });

  it("should reset games completed by type", async () => {
    const response = await request(app)
      .patch(`${API_BASE_URL}/resetGamesCompletedByType`)
      .set("Authorization", token)
      .send({ gameType: "GuessTheImageGame" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
  });

  it("should return an error if a guess the image game is already in progress", async () => {
    const createNew = await request(app)
      .post(`${API_BASE_URL}/guessTheImageGames`)
      .set("Authorization", token)
      .send({ deckId });

    const gameResponse = await request(app)
      .get(
        `${API_BASE_URL}/guessTheImageGame/${createNew.body.guessTheImageGameId}`
      )
      .set("Authorization", token);

    const correctAnswer = gameResponse.body.correctAnswer;
    await request(app)
      .post(
        `${API_BASE_URL}/currentGuessTheImageGame/${createNew.body.guessTheImageGameId}`
      )
      .set("Authorization", token)
      .send({ selectedAnswer: correctAnswer, timeTaken: 10 });

    const response = await request(app)
      .post(
        `${API_BASE_URL}/currentGuessTheImageGame/${createNew.body.guessTheImageGameId}`
      )
      .set("Authorization", token)
      .send({ selectedAnswer: correctAnswer, timeTaken: 10 });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Ya tienes un Juego de Adivinar la Imagen en progreso"
    );
  });
});
