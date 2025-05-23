import request from "supertest";

//local imports
import { before, after } from "./utils/hooks";
import app from "../src/app";
import { API_BASE_URL, AUTH_BASE_URL } from "./utils/constants";
import { user } from "./utils/newUser";
import {
  validGuessTheImageGame,
  validGuessTheImageGame2,
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
let gameId2: string;
let guessTheImageGameId: string;
let guessTheImageGameId2: string;
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

  const response3 = await request(app)
    .post(`${API_BASE_URL}/guessTheImageGames`)
    .set("Authorization", token)
    .send({ ...validGuessTheImageGame2, deckId });

  guessTheImageGameId = response2.body.guessTheImageGame._id;
  gameId = response2.body.game._id;

  guessTheImageGameId2 = response3.body.guessTheImageGame._id;
  gameId2 = response3.body.game._id;
});

describe("GuessTheImageGame API", () => {
  it("should get all guess the image games", async () => {
    const response = await request(app)
      .get(`${API_BASE_URL}/guessTheImageGames`)
      .set("Authorization", token);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
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

  it("should complete a guess the image match with the correct answer and finish the game", async () => {
    const gameResponse = await request(app)
      .get(`${API_BASE_URL}/guessTheImageGame/${guessTheImageGameId}`)
      .set("Authorization", token);

    const correctAnswer = gameResponse.body.correctAnswer;

    const response = await request(app)
      .post(`${API_BASE_URL}/currentGuessTheImageGame/${guessTheImageGameId}`)
      .set("Authorization", token)
      .send({ selectedAnswer: correctAnswer });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("currentGame", 2);
    expect(response.body).toHaveProperty(
      "message",
      "¡Felicidades! Has completado las 1 partidas de GuessTheImageGame."
    );
    expect(response.body).toHaveProperty("totalGames", 1);
  }, 3000);

  it("should complete a guess the image match with the correct answer and pass to the next match", async () => {
    const gameResponse = await request(app)
      .get(`${API_BASE_URL}/guessTheImageGame/${guessTheImageGameId2}`)
      .set("Authorization", token);

    const correctAnswer = gameResponse.body.correctAnswer;

    const response = await request(app)
      .post(`${API_BASE_URL}/currentGuessTheImageGame/${guessTheImageGameId2}`)
      .set("Authorization", token)
      .send({ selectedAnswer: correctAnswer });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("currentGame", 2);
    expect(response.body).toHaveProperty("totalGames", 2);
    expect(response.body).toHaveProperty("gameId");
    expect(response.body.gameId).toHaveProperty("completed", false);
    expect(response.body.gameId).toHaveProperty("currentGameCount", 1);
    expect(response.body).toHaveProperty("guessTheImageGameId");
  }, 3000);

  it("should force complete a guess the image game", async () => {
    const response = await request(app)
      .post(`${API_BASE_URL}/currentGuessTheImageGame/${guessTheImageGameId}`)
      .set("Authorization", token)
      .send({
        selectedAnswer: "WRONG_ANSWER",
        forceComplete: true,
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
});
