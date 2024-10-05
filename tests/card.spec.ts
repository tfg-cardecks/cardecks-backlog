import request from "supertest";

// local imports
import { before, after } from "./utils/hooks";
import app from "../src/app";
import { API_BASE_URL, AUTH_BASE_URL } from "./utils/constants";
import { user } from "./utils/newUser";
import { badCards, card, card2 } from "./utils/newCard";

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
    .post(`${API_BASE_URL}/cards`)
    .set("Authorization", token)
    .send(card);

  id = response2.body._id;

  const response3 = await request(app)
    .post(`${API_BASE_URL}/cards`)
    .set("Authorization", token)
    .send(card2);

  id2 = response3.body._id;
});

describe("Testing get cards method", () => {
  it("Can get all cards", async () => {
    const response = await request(app)
      .get(`${API_BASE_URL}/cards`)
      .set("Authorization", token);
    expect(response.status).toBe(200);
  });

  it("Can't get all cards without token", async () => {
    const response = await request(app).get(`${API_BASE_URL}/cards`);
    expect(response.status).toBe(401);
    expect(response.body.error).toBe(
      "Debes iniciar sesión para usar esta función"
    );
  });

  it("Can't get all cards with invalid token", async () => {
    const response = await request(app)
      .get(`${API_BASE_URL}/cards`)
      .set("Authorization", "invalid token");
    expect(response.status).toBe(403);
    expect(response.body.error).toBe("Token inválido");
  });

  it("Can't get all cards with anonymous user", async () => {
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
      .get(`${API_BASE_URL}/cards`)
      .set("Authorization", response.body.token);
    expect(response2.status).toBe(403);
    expect(response2.body.message).toBe(
      "Debes iniciar sesión para usar esta función"
    );
  });

  it("Can get an specific card", async () => {
    const response2 = await request(app)
      .get(`${API_BASE_URL}/card/${id}`)
      .set("Authorization", token);
    expect(response2.status).toBe(200);
  });

  it("Can't get an specific card (card not found)", async () => {
    const response2 = await request(app)
      .get(`${API_BASE_URL}/card/66fbe37b9d600a318c38ab12`)
      .set("Authorization", token);
    expect(response2.status).toBe(404);
  });

  it("Can't get an specific card (error)", async () => {
    const response2 = await request(app)
      .get(`${API_BASE_URL}/card/invalidId`)
      .set("Authorization", token);
    expect(response2.status).toBe(500);
  });
});

describe("Testing create card method", () => {
  badCards.forEach((badCard) => {
    it("Can't create a card with invalid data", async () => {
      const response = await request(app)
        .post(`${API_BASE_URL}/cards`)
        .set("Authorization", token)
        .send(badCard);
      expect(response.status).toBe(400);
    });
  });
});

describe("Testing update card method", () => {
  it("Can update a card", async () => {
    const updatedCard = { ...card, title: "Updated Title" };
    const response = await request(app)
      .patch(`${API_BASE_URL}/card/${id}`)
      .set("Authorization", token)
      .send(updatedCard);
    expect(response.status).toBe(200);
  });

  it("Can't update a card with invalid data", async () => {
    const response = await request(app)
      .patch(`${API_BASE_URL}/card/${id}`)
      .set("Authorization", token)
      .send({ title: "" });
    expect(response.status).toBe(400);
  });

  it("Can't update a card with invalid id", async () => {
    const response = await request(app)
      .patch(`${API_BASE_URL}/card/invalidId`)
      .set("Authorization", token)
      .send({ title: "New Title" });
    expect(response.status).toBe(400);
  });
});

describe("Testing delete card method", () => {
  it("Can delete a card", async () => {
    const response = await request(app)
      .delete(`${API_BASE_URL}/card/${id}`)
      .set("Authorization", token);
    expect(response.status).toBe(204);
  });

  it("Can't delete a card with invalid id", async () => {
    const response = await request(app)
      .delete(`${API_BASE_URL}/card/invalidId`)
      .set("Authorization", token);
    expect(response.status).toBe(500);
  });
});

describe("Testing get cards by user id method", () => {
  it("Can get cards by user id", async () => {
    const response = await request(app)
      .get(`${API_BASE_URL}/user/${userId}/cards`)
      .set("Authorization", token);
    expect(response.status).toBe(200);
  });

  it("Can't get cards by user id with invalid id", async () => {
    const response = await request(app)
      .get(`${API_BASE_URL}/user/invalidId/cards`)
      .set("Authorization", token);
    expect(response.status).toBe(500);
  });
});

describe("Testing export card method", () => {
  it("Can't get an specific card (card not found)", async () => {
    const response = await request(app)
      .get(`${API_BASE_URL}/card/${id}`)
      .set("Authorization", token);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Carta no encontrada");
  });

  it("Can't delete a card (card not found)", async () => {
    const response = await request(app)
      .delete(`${API_BASE_URL}/card/${id}`)
      .set("Authorization", token);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Carta no encontrada");
  });

  it("Can export a card", async () => {
    const response = await request(app)
      .post(`${API_BASE_URL}/card/export/${id2}`)
      .set("Authorization", token);
    expect(response.status).toBe(200);
  });

  it("Can't export a card (card not found)", async () => {
    const response = await request(app)
      .post(`${API_BASE_URL}/card/export/${id}`)
      .set("Authorization", token);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Carta no encontrada");
  });

  it("Can't export a card with invalid id", async () => {
    const response = await request(app)
      .post(`${API_BASE_URL}/card/export/invalidId`)
      .set("Authorization", token);
    expect(response.status).toBe(500);
  });
});

describe("Testing import card method", () => {
  it("Can't import a card (misssing file input)", async () => {
    const response = await request(app)
      .post(`${API_BASE_URL}/card/import`)
      .set("Authorization", token);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "No se ha proporcionado ningún archivo."
    );
  });

  it("Can't import a card (invalid json)", async () => {
    const response = await request(app)
      .post(`${API_BASE_URL}/card/import`)
      .set("Authorization", token)
      .attach("file", "tests/utils/invalidCard.json");
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "El archivo proporcionado no es un JSON válido."
    );
  });

  it("Can't import a card (invalid data)", async () => {
    const response = await request(app)
      .post(`${API_BASE_URL}/card/import`)
      .set("Authorization", token)
      .attach("file", "tests/utils/invalidCardData.json");
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Carta inválida: Tipo de carta inválido."
    );
  });

  it("Can import a card", async () => {
    const response = await request(app)
      .post(`${API_BASE_URL}/card/import`)
      .set("Authorization", token)
      .attach("file", "tests/utils/validCard.json");
    expect(response.status).toBe(201);
  });
});
