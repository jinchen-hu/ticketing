import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import app from "../app";
import { JWT_KEY } from "../../config";
import request from "supertest";
import { StatusCodes } from "http-status-codes";

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = JWT_KEY;
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

export const getAuthCookie = async (): Promise<string[]> => {
  const email: string = "test@test.com";
  const password: string = "1234";

  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email,
      password,
    })
    .expect(StatusCodes.CREATED);

  return response.get("Set-Cookie");
};
