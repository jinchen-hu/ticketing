import request from "supertest";
import app from "../../app";
import { StatusCodes } from "http-status-codes";
import { fakeTicketId, getMockCookie } from "../../test/setup";

it("returns 404 if the ticket is not found", async () => {
  await request(app)
    .get(`/api/tickets/${fakeTicketId}`)
    .send({})
    .expect(StatusCodes.NOT_FOUND);
});

it("return the tickets with correct request", async () => {
  const title = "Test title";
  const price = 20;
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", getMockCookie())
    .send({
      title,
      price,
    })
    .expect(StatusCodes.CREATED);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send({})
    .expect(StatusCodes.OK);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
