import request from "supertest";
import app from "../../app";
import { StatusCodes } from "http-status-codes";

it(`returns a ${StatusCodes.CREATED} on successful signup`, async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "1234" })
    .expect(StatusCodes.CREATED);
});

it("should return a 400 with an invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "testtest.com", password: "1234" })
    .expect(StatusCodes.BAD_REQUEST);
});

it("should return a 400 with an invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "1" })
    .expect(StatusCodes.BAD_REQUEST);
});

it("should return a 400 with missing email and password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "", password: "1234" })
    .expect(StatusCodes.BAD_REQUEST);

  return request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "" })
    .expect(StatusCodes.BAD_REQUEST);
});

it("disallows duplicate email", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "1234" })
    .expect(StatusCodes.CREATED);

  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "1234" })
    .expect(StatusCodes.BAD_REQUEST);
});

it("sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "1234" })
    .expect(StatusCodes.CREATED);

  expect(response.get("Set-Cookie")).toBeDefined();
});
