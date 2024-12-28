import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT ?? 3000;
export const DB_STRING = process.env.DB_STRING!;
export const APP_NAME = process.env.APP_NAME!;
export const DB_NAME = process.env.DB_NAME!;
export const EMAIL_USER = process.env.EMAIL_USER!;
export const EMAIL_PASS = process.env.EMAIL_PASS!;
