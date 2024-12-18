import request from "supertest";

//local imports
import { before, after } from "./utils/hooks";
import app from "../src/app";
import { API_BASE_URL, AUTH_BASE_URL } from "./utils/constants";
import { user } from "./utils/newUser";
import {
  validWordSearchGame,
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
});

describe("Game API", () => {
  it("Can get all games", async () => {
    const response = await request(app)
      .get(`${API_BASE_URL}/games`)
      .set("Authorization", token);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it("Can get an specific game", async () => {
    const response = await request(app)
      .get(`${API_BASE_URL}/game/${gameId}`)
      .set("Authorization", token);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id", gameId);
  });

  it("Can't get an specific game (game not found)", async () => {
    const response = await request(app)
      .get(`${API_BASE_URL}/game/66fbe37b9d600a318c38ab12`)
      .set("Authorization", token);

    expect(response.status).toBe(404);
  });

  it("Can't get an specific deck (error)", async () => {
    const response = await request(app)
      .get(`${API_BASE_URL}/game/invalidId`)
      .set("Authorization", token);
    expect(response.status).toBe(500);
  });

  it("should delete a game by ID", async () => {
    const response = await request(app)
      .delete(`${API_BASE_URL}/game/${gameId}`)
      .set("Authorization", token);

    expect(response.status).toBe(204);
  });

  it("should return 404 when deleting a non-existent game ID", async () => {
    const response = await request(app)
      .delete(`${API_BASE_URL}/game/66fbe37b9d600a318c38ab12`)
      .set("Authorization", token);

    expect(response.status).toBe(404);
  });

  it("should return 404 when deleting a non-existent game ID", async () => {
    const response = await request(app)
      .delete(`${API_BASE_URL}/game/nonexistentId`)
      .set("Authorization", token);

    expect(response.status).toBe(500);
  });
});
