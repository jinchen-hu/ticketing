import request from "supertest";
import app from "../../app";
import { StatusCodes } from "http-status-codes";

it("responds with details about the current user", async () => {
  const authResponse = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "1234",
    })
    .expect(StatusCodes.CREATED);

  const cookie = authResponse.get("Set-Cookie");

  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send({})
    .expect(StatusCodes.OK);

  expect(response.body.currentUser.email).toEqual("test@test.com");
});
