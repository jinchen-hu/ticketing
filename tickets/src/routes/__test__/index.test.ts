import request from "supertest";
import app from "../../app";
import { getMockCookie } from "../../test/setup";
import { StatusCodes } from "http-status-codes";

const createTicket = async () => {
  const title = "Test title";
  const price = 20;
  await request(app)
    .post("/api/tickets")
    .set("Cookie", getMockCookie())
    .send({
      title,
      price,
    })
    .expect(StatusCodes.CREATED);
};

it("can fetch a list of tickets", async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app)
    .get("/api/tickets")
    .send({})
    .expect(StatusCodes.OK);

  expect(response.body.length).toEqual(3);
});
