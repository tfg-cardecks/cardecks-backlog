import request from "supertest";

// local imports
import { before, after } from "./utils/hooks";
import app from "../src/app";
import { AUTH_BASE_URL } from "./utils/constants";
import { badUsers, user } from "./utils/newUser";

before;
after;

describe("Testing register method", () => {
  it("Can register one user", async () => {
    const response = await request(app)
      .post(`${AUTH_BASE_URL}/signup`)
      .send(user);
    expect(response.status).toBe(201);
  });

  badUsers.forEach((badUser) => {
    it(`Cannot register user with ${badUser}`, async () => {
      const response = await request(app)
        .post(`${AUTH_BASE_URL}/signup`)
        .send(badUser);
      expect(response.status).toBe(400);
    });
  });
});

describe("Testing login method", () => {
  it("Can login one user", async () => {
    const response = await request(app)
      .post(`${AUTH_BASE_URL}/signin`)
      .send({ emailOrUsername: user.username, password: user.password });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("role");
    expect(response.body).toHaveProperty("username");
    expect(response.body).toHaveProperty("id");
  });

  it("Cannot login with wrong password", async () => {
    const response = await request(app)
      .post(`${AUTH_BASE_URL}/signin`)
      .send({ emailOrUsername: user.email, password: "wrongPassword" });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Contraseña inválida");
  });

  it("Cannot login with wrong email", async () => {
    const response = await request(app)
      .post(`${AUTH_BASE_URL}/signin`)
      .send({ emailOrUsername: "wrongEmail", password: user.password });
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Usuario no encontrado");
  });
});
