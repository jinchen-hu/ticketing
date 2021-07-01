import request from "supertest";
import app from "../../app";
import { StatusCodes } from "http-status-codes";

it("fails when an email not existing", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "1234",
    })
    .expect(StatusCodes.BAD_REQUEST);
});

it("fails when an incorrect password is provided", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "1234",
    })
    .expect(StatusCodes.CREATED);

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "12345",
    })
    .expect(StatusCodes.BAD_REQUEST);
});

it("responds with a cookie when valid credentials given", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "1234",
    })
    .expect(StatusCodes.CREATED);

  const resonse = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "1234",
    })
    .expect(StatusCodes.OK);

  expect(resonse.get("Set-Cookie")).toBeDefined();
});
