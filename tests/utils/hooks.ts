import { clearDatabase, closeDatabase, connect } from "./db";

export const before = beforeAll(async () => {
  await connect();
});

export const after = afterAll(async () => {
  await clearDatabase();
  await closeDatabase();
});
