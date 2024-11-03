import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app";
import { API_BASE_URL, AUTH_BASE_URL } from "./utils/constants";
import { user, badUsers } from "./utils/newUser";
import { before, after } from "./utils/hooks";

before;
after;

let token: string;
let userId: string;

beforeAll(async () => {
  await request(app).post(`${AUTH_BASE_URL}/signup`).send(user);
  const response = await request(app)
    .post(`${AUTH_BASE_URL}/signin`)
    .send({ emailOrUsername: user.username, password: user.password });

  token = response.body.token;
  userId = response.body.id;
});

describe("User Routes", () => {
  it("should get all users", async () => {
    const response = await request(app)
      .get(`${API_BASE_URL}/users`)
      .set("Authorization", token);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it("should get a user by ID", async () => {
    const response = await request(app)
      .get(`${API_BASE_URL}/user/${userId}`)
      .set("Authorization", token);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("username", user.username);
  });

  it("should edit a user by ID", async () => {
    const newUsername = "newUsername";
    const newEmail = "newemail@gmail.com";
    const response = await request(app)
      .patch(`${API_BASE_URL}/user/${userId}`)
      .set("Authorization", token)
      .send({ username: newUsername, email: newEmail });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("username", newUsername);
    expect(response.body).toHaveProperty("email", newEmail);
  });

  it("should not edit a user by ID", async () => {
    const newUsername = "newUsername";
    const newEmail = "newemail@gm.com";
    const response = await request(app)
      .patch(`${API_BASE_URL}/user/${userId}`)
      .set("Authorization", token)
      .send({ username: newUsername, email: newEmail });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "El correo electrónico debe ser de gmail, hotmail o outlook"
    );
  });

  it("should return 404 for non-existent user", async () => {
    const nonExistentUserId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .get(`${API_BASE_URL}/user/${nonExistentUserId}`)
      .set("Authorization", token);
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Usuario no encontrado");
  });

  it("should delete a user", async () => {
    const response = await request(app)
      .delete(`${API_BASE_URL}/user/${userId}`)
      .set("Authorization", token);
    expect(response.status).toBe(204);
  });

  it("should return 404 when deleting a non-existent user", async () => {
    const nonExistentUserId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .delete(`${API_BASE_URL}/user/${nonExistentUserId}`)
      .set("Authorization", token);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Usuario no encontrado");
  });
});
