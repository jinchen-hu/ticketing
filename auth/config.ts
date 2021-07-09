import * as dotenv from "dotenv";

dotenv.config({ path: `${__dirname}/.env.test` });

export const JWT_KEY: string | null = process.env.JWT_KEY || null;

if (!JWT_KEY) {
  throw new Error("JWT_KEY must be defined");
}
