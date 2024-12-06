import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app";
import { API_BASE_URL, AUTH_BASE_URL } from "./utils/constants";
import { user, user2 } from "./utils/newUser";
import { before, after } from "./utils/hooks";
import { User } from "../src/models/user";

before;
after;

let token: string;
let userId: string;
let token2: string;
let userId2: string;

beforeAll(async () => {
  await request(app).post(`${AUTH_BASE_URL}/signup`).send(user);
  const response = await request(app)
    .post(`${AUTH_BASE_URL}/signin`)
    .send({ emailOrUsername: user.username, password: user.password });

  await request(app).post(`${AUTH_BASE_URL}/signup`).send(user2);
  const response2 = await request(app)
    .post(`${AUTH_BASE_URL}/signin`)
    .send({ emailOrUsername: user2.username, password: user2.password });

  token = response.body.token;
  userId = response.body.id;
  token2 = response2.body.token;
  userId2 = response2.body.id;
});

describe("User Routes", () => {
  it("should not reset password with invalid token", async () => {
    const invalidToken = "invalidToken";
    const newPassword = "NewPassword123!";
    const response = await request(app)
      .post(`${API_BASE_URL}/user/forgot-password/${invalidToken}`)
      .send({ newPassword });
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message");
  });

  it("should not request a password reset for a non-existent user", async () => {
    const email = "nonexistent@example.com";
    const response = await request(app)
      .post(`${API_BASE_URL}/user/forgot-password`)
      .send({ email });
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Usuario no encontrado");
  });

  it("should get all users", async () => {
    const response = await request(app)
      .get(`${API_BASE_URL}/users`)
      .set("Authorization", token);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it("should get an user by ID", async () => {
    const response = await request(app)
      .get(`${API_BASE_URL}/user/${userId}`)
      .set("Authorization", token);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("username", user.username);
  });

  it("should edit an user by ID", async () => {
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

  it("should edit a password of a user by ID", async () => {
    const usuario = await User.findOne({ username: user2.username });
    const usuarioId = usuario?._id;

    const newUserPassword = "NewPassword12334!@";

    const response = await request(app)
      .patch(`${API_BASE_URL}/user/${usuarioId}/password`)
      .set("Authorization", token2)
      .send({ currentPassword: user2.password, newPassword: newUserPassword });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Contraseña actualizada con éxito"
    );
  });

  it("should not edit a password of a user by ID", async () => {
    const newUserPassword = "NewPassword12333!";
    const response = await request(app)
      .patch(`${API_BASE_URL}/user/${userId}/password`)
      .set("Authorization", token)
      .send({ currentPassword: newUserPassword, newPassword: newUserPassword });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Contraseña actual incorrecta"
    );
  });

  it("should not edit an user by ID", async () => {
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
