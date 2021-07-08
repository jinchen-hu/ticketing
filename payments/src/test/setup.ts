import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { JWT_KEY, STRIPE_KEY } from "../../config";
import jwt from "jsonwebtoken";
// fake import
jest.mock("../nats-wrapper");

let mongo: any;
beforeAll(async () => {
  //process.env.JWT_KEY = JWT_KEY;
  mongo = new MongoMemoryServer();
  await mongo.start();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  // const collections = await mongoose.connection.db.collections();
  //
  // for (let collection of collections) {
  //   await collection.deleteMany({});
  // }
  await mongoose.connection.close();
  await mongo.stop();
});
export const fakeTicketId = new mongoose.Types.ObjectId().toHexString();

export const getMockCookie = (id?: string): string[] => {
  // build JWT payload

  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };

  // create the JWT
  const token = jwt.sign(payload, JWT_KEY);
  // build session object
  const session = { jwt: token };
  // turn that session into JSON
  const sessionJson = JSON.stringify(session);
  // take the JSON and encode using base64
  const base64 = Buffer.from(sessionJson).toString("base64");
  // return a string that is a cookie with encoded data
  return [`express:sess=${base64}`];
};
