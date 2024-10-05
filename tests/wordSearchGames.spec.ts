// import request from 'supertest';

// //local imports
// import { before, after } from "./utils/hooks";
// import app from '../src/app';
// import { API_BASE_URL, AUTH_BASE_URL } from "./utils/constants";
// import { user } from "./utils/newUser";
// import { badDecks, deck, deck2 } from "./utils/newDeck";
// import { validWordSearchGame, invalidWordSearchGames } from './utils/newWordSearchGame';
// import mongoose from 'mongoose';

// before;
// after;

// let token: string;
// let gameId: string;
// let wordSearchGameId: string;
// let userId: string;

// beforeAll(async () => {
//   await request(app).post(`${AUTH_BASE_URL}/signup`).send(user);
//   const response = await request(app)
//     .post(`${AUTH_BASE_URL}/signin`)
//     .send({ emailOrUsername: user.username, password: user.password });

//   token = response.body.token;
//   userId = response.body.id;

//   const response2 = await request(app)
//     .post(`${API_BASE_URL}/wordSearchGames`)
//     .set("Authorization", token)
//     .send(validWordSearchGame);

//     gameId = response2.body._id;
// });

// afterAll(async () => {
//   await clearDatabase();
//   await disconnect();
// });

// describe('WordSearchGame API', () => {
//   it('should get all games', async () => {
//     const response = await request(app)
//       .get('/api/games')
//       .set('Authorization', `Bearer ${token}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toBeInstanceOf(Array);
//   });

//   it('should get a game by ID', async () => {
//     const response = await request(app)
//       .get(`/api/games/${gameId}`)
//       .set('Authorization', `Bearer ${token}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('_id', gameId);
//   });

//   it('should return 404 if game not found', async () => {
//     const response = await request(app)
//       .get('/api/games/nonexistentId')
//       .set('Authorization', `Bearer ${token}`);

//     expect(response.status).toBe(404);
//     expect(response.body).toHaveProperty('message', 'Juego no encontrado');
//   });

//   it('should delete a game', async () => {
//     const response = await request(app)
//       .delete(`/api/games/${gameId}`)
//       .set('Authorization', `Bearer ${token}`);

//     expect(response.status).toBe(204);
//   });

//   it('should return 404 if game to delete not found', async () => {
//     const response = await request(app)
//       .delete('/api/games/nonexistentId')
//       .set('Authorization', `Bearer ${token}`);

//     expect(response.status).toBe(404);
//     expect(response.body).toHaveProperty('message', 'Juego no encontrado');
//   });

//   it('should not create a game with invalid data', async () => {
//     for (const invalidGame of invalidWordSearchGames) {
//       const response = await request(app)
//         .post('/api/games')
//         .set('Authorization', `Bearer ${token}`)
//         .send(invalidGame);

//       expect(response.status).toBe(400);
//     }
//   });
// });