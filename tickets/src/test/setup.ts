import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { JWT_KEY } from "../../config";
import jwt from "jsonwebtoken";

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

export const getMockCookie = (): string[] => {
  // build JWT payload
  const id = new mongoose.Types.ObjectId().toHexString();
  //console.log(id);
  const payload = {
    id,
    email: "test@test.com",
  };

  // create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  // build session object
  const session = { jwt: token };
  // turn that session into JSON
  const sessionJson = JSON.stringify(session);
  // take the JSON and encode using base64
  const base64 = Buffer.from(sessionJson).toString("base64");
  // return a string that is a cookie with encoded data
  return [`express:sess=${base64}`];
};
