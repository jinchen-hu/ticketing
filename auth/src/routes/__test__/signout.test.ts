import request from "supertest";
import app from "../../app";
import { StatusCodes } from "http-status-codes";

it("clears cookie after signout", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "1234",
    })
    .expect(StatusCodes.CREATED);

  const response = await request(app)
    .post("/api/users/signout")
    .send({})
    .expect(StatusCodes.OK);

  expect(response.get("Set-Cookie")[0]).toEqual(
    "express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
  );
});
