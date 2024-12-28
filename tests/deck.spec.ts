import request from "supertest";

// local imports
import { before, after } from "./utils/hooks";
import app from "../src/app";
import { API_BASE_URL, AUTH_BASE_URL } from "./utils/constants";
import { user } from "./utils/newUser";
import { badDecks, deck, deck2 } from "./utils/newDeck";
import mongoose from "mongoose";

before;
after;

let token: string;
let id: string;
let id2: string;
let userId: string;

beforeAll(async () => {
  await request(app).post(`${AUTH_BASE_URL}/signup`).send(user);
  const response = await request(app)
    .post(`${AUTH_BASE_URL}/signin`)
    .send({ emailOrUsername: user.username, password: user.password });

  token = response.body.token;
  userId = response.body.id;

  const response2 = await request(app)
    .post(`${API_BASE_URL}/decks`)
    .set("Authorization", token)
    .send(deck);

  id = response2.body._id;

  const response3 = await request(app)
    .post(`${API_BASE_URL}/decks`)
    .set("Authorization", token)
    .send(deck2);

  id2 = response3.body._id;
});

describe("Testing import card in deck method", () => {
  it("Can import a card into a deck", async () => {
    const response = await request(app)
      .post(`${API_BASE_URL}/deck/${id}/importCard`)
      .set("Authorization", token)
      .attach("file", "tests/utils/validCard.json");
    expect(response.status).toBe(201);
    expect(response.body.title).toContain("Card Title 3");
  });

  it("Can't import a card into a non-existent deck", async () => {
    const nonExistentDeckId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .post(`${API_BASE_URL}/deck/${nonExistentDeckId}/importCard`)
      .set("Authorization", token)
      .attach("file", "tests/utils/validCard.json");
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Mazo no encontrado");
  });

  it("Can't import a card without providing a file", async () => {
    const response = await request(app)
      .post(`${API_BASE_URL}/deck/${id}/importCard`)
      .set("Authorization", token);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "No se ha proporcionado ningún archivo."
    );
  });

  it("Can't import a card with invalid JSON", async () => {
    const response = await request(app)
      .post(`${API_BASE_URL}/deck/${id}/importCard`)
      .set("Authorization", token)
      .attach("file", "tests/utils/invalidCard.json");
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "El archivo proporcionado no es un JSON válido."
    );
  });

  it("Can't import a card with invalid card data", async () => {
    const response = await request(app)
      .post(`${API_BASE_URL}/deck/${id}/importCard`)
      .set("Authorization", token)
      .attach("file", "tests/utils/invalidCardData.json");
    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Carta inválida");
  });
});

describe("Testing get decks method", () => {
  it("Can get all decks", async () => {
    const response = await request(app)
      .get(`${API_BASE_URL}/decks`)
      .set("Authorization", token);
    expect(response.status).toBe(200);
  });

  it("Can't get all decks without token", async () => {
    const response = await request(app).get(`${API_BASE_URL}/decks`);
    expect(response.status).toBe(401);
    expect(response.body.error).toBe(
      "Debes iniciar sesión para usar esta función"
    );
  });

  it("Can't get all decks with invalid token", async () => {
    const response = await request(app)
      .get(`${API_BASE_URL}/decks`)
      .set("Authorization", "invalid token");
    expect(response.status).toBe(403);
    expect(response.body.error).toBe("Token inválido");
  });

  it("Can't get all decks with anonymous user", async () => {
    const anonymousUser = {
      ...user,
      role: "anonymous",
      username: "anonymous",
      email: "anon@gmail.com",
    };
    await request(app).post(`${AUTH_BASE_URL}/signup`).send(anonymousUser);
    const response = await request(app).post(`${AUTH_BASE_URL}/signin`).send({
      emailOrUsername: anonymousUser.username,
      password: anonymousUser.password,
    });

    const response2 = await request(app)
      .get(`${API_BASE_URL}/decks`)
      .set("Authorization", response.body.token);
    expect(response2.status).toBe(403);
    expect(response2.body.message).toBe(
      "Debes iniciar sesión para usar esta función"
    );
  });

  it("Can get an specific deck", async () => {
    const response2 = await request(app)
      .get(`${API_BASE_URL}/deck/${id}`)
      .set("Authorization", token);
    expect(response2.status).toBe(200);
  });

  it("Can't get an specific deck (deck not found)", async () => {
    const response2 = await request(app)
      .get(`${API_BASE_URL}/deck/66fbe37b9d600a318c38ab12`)
      .set("Authorization", token);
    expect(response2.status).toBe(404);
  });
  it("Can't get an specific deck (error)", async () => {
    const response2 = await request(app)
      .get(`${API_BASE_URL}/deck/invalidId`)
      .set("Authorization", token);
    expect(response2.status).toBe(500);
  });
});

describe("Testing create deck method", () => {
  badDecks.forEach((badDeck) => {
    it("Can't create a deck with invalid data", async () => {
      const response = await request(app)
        .post(`${API_BASE_URL}/decks`)
        .set("Authorization", token)
        .send(badDeck);
      expect(response.status).toBe(400);
    });
  });
});

describe("Testing update deck method", () => {
  it("Can update a deck", async () => {
    const updatedDeck = { ...deck, name: "Updated Name" };
    const response = await request(app)
      .patch(`${API_BASE_URL}/deck/${id}`)
      .set("Authorization", token)
      .send(updatedDeck);
    expect(response.status).toBe(200);
  });

  it("Can't update a deck with invalid data", async () => {
    const response = await request(app)
      .patch(`${API_BASE_URL}/deck/${id}`)
      .set("Authorization", token)
      .send({ name: "" });
    expect(response.status).toBe(400);
  });
  it("Can't update a deck with invalid id", async () => {
    const response = await request(app)
      .patch(`${API_BASE_URL}/deck/invalidId`)
      .set("Authorization", token)
      .send({ name: "New Name" });
    expect(response.status).toBe(400);
  });
});

describe("Testing delete deck method", () => {
  it("Can delete a deck", async () => {
    const response = await request(app)
      .delete(`${API_BASE_URL}/deck/${id}`)
      .set("Authorization", token);
    expect(response.status).toBe(204);
  });

  it("Can't delete a deck with invalid id", async () => {
    const response = await request(app)
      .delete(`${API_BASE_URL}/deck/invalidId`)
      .set("Authorization", token);
    expect(response.status).toBe(500);
  });
});

describe("Testing get decks by user id method", () => {
  it("Can get decks by user id", async () => {
    const response = await request(app)
      .get(`${API_BASE_URL}/user/${userId}/decks`)
      .set("Authorization", token);
    expect(response.status).toBe(200);
  });

  it("Can't get decks by user id with invalid id", async () => {
    const response = await request(app)
      .get(`${API_BASE_URL}/user/invalidId/decks`)
      .set("Authorization", token);
    expect(response.status).toBe(500);
  });
});

describe("Testing export deck method", () => {
  it("Can't get an specific deck (deck not found)", async () => {
    const response = await request(app)
      .get(`${API_BASE_URL}/deck/${id}`)
      .set("Authorization", token);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Mazo no encontrado");
  });

  it("Can't delete a deck (deck not found)", async () => {
    const response = await request(app)
      .delete(`${API_BASE_URL}/deck/${id}`)
      .set("Authorization", token);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Mazo no encontrado");
  });

  it("Can export a deck", async () => {
    const response = await request(app)
      .post(`${API_BASE_URL}/deck/export/${id2}`)
      .set("Authorization", token);
    expect(response.status).toBe(200);
  });

  it("Can't export a deck (deck not found)", async () => {
    const response = await request(app)
      .post(`${API_BASE_URL}/deck/export/${id}`)
      .set("Authorization", token);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Mazo no encontrado");
  });

  it("Can't export a deck with invalid id", async () => {
    const response = await request(app)
      .post(`${API_BASE_URL}/deck/export/invalidId`)
      .set("Authorization", token);
    expect(response.status).toBe(500);
  });
});

describe("Testing import deck method", () => {
  it("Can't import a deck (misssing file input)", async () => {
    const response = await request(app)
      .post(`${API_BASE_URL}/deck/import`)
      .set("Authorization", token);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "No se ha proporcionado ningún archivo."
    );
  });

  it("Can't import a deck (invalid json)", async () => {
    const response = await request(app)
      .post(`${API_BASE_URL}/deck/import`)
      .set("Authorization", token)
      .attach("file", "tests/utils/invalidDeck.json");
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "El archivo proporcionado no es un JSON válido."
    );
  });

  it("Can't import a deck (invalid data)", async () => {
    const response = await request(app)
      .post(`${API_BASE_URL}/deck/import`)
      .set("Authorization", token)
      .attach("file", "tests/utils/invalidDeckData.json");
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "El archivo proporcionado no es un mazo válido."
    );
  });

  it("Can import a deck", async () => {
    const response = await request(app)
      .post(`${API_BASE_URL}/deck/import`)
      .set("Authorization", token)
      .attach("file", "tests/utils/validDeck.json");
    expect(response.status).toBe(201);
  });
});

describe("Testing authorization for deck methods", () => {
  it("Can't create a deck without token", async () => {
    const response = await request(app)
      .post(`${API_BASE_URL}/decks`)
      .send(deck);
    expect(response.status).toBe(401);
    expect(response.body.error).toBe(
      "Debes iniciar sesión para usar esta función"
    );
  });

  it("Can't update a deck without token", async () => {
    const response = await request(app)
      .patch(`${API_BASE_URL}/deck/${id}`)
      .send({ name: "Updated Name" });
    expect(response.status).toBe(401);
    expect(response.body.error).toBe(
      "Debes iniciar sesión para usar esta función"
    );
  });

  it("Can't delete a deck without token", async () => {
    const response = await request(app).delete(`${API_BASE_URL}/deck/${id}`);
    expect(response.status).toBe(401);
    expect(response.body.error).toBe(
      "Debes iniciar sesión para usar esta función"
    );
  });
});
