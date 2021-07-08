import * as dotenv from "dotenv";

dotenv.config({ path: `${__dirname}/.env.test` });

export const JWT_KEY: string = process.env.JWT_KEY || "";
export const STRIPE_KEY: string = process.env.STRIPE_KEY || "";
