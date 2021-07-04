import request from "supertest";
import app from "../../app";
import { StatusCodes } from "http-status-codes";
import { getMockCookie } from "../../test/setup";
import { Ticket, TicketDoc } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("has a route handler listening to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).not.toEqual(StatusCodes.NOT_FOUND);
});

it("can only be accessed if the user is signed in", async () => {
  await request(app)
    .post("/api/tickets")
    .send({})
    .expect(StatusCodes.UNAUTHORIZED);
});

it("returns status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", getMockCookie())
    .send({});

  expect(response.status).not.toEqual(StatusCodes.UNAUTHORIZED);
});

it("returns an error if an invalid title is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", getMockCookie())
    .send({
      title: "",
      price: 10,
    })
    .expect(StatusCodes.BAD_REQUEST);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", getMockCookie())
    .send({
      price: 10,
    })
    .expect(StatusCodes.BAD_REQUEST);
});

it("returns an error if an invalid price is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", getMockCookie())
    .send({
      title: "Sydney Concert",
      price: -10,
    })
    .expect(StatusCodes.BAD_REQUEST);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", getMockCookie())
    .send({
      title: "Sydney Concert",
    })
    .expect(StatusCodes.BAD_REQUEST);
});

it("creates a ticket with valid inputs", async () => {
  let tickets: TicketDoc[] = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const title: string = "Sydney Concert";
  const price: number = 10;
  await request(app)
    .post("/api/tickets")
    .set("Cookie", getMockCookie())
    .send({
      title,
      price,
    })
    .expect(StatusCodes.CREATED);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(price);
  expect(tickets[0].title).toEqual(title);
});

it("publishes an event", async () => {
  const title: string = "Sydney Concert";
  const price: number = 10;
  await request(app)
    .post("/api/tickets")
    .set("Cookie", getMockCookie())
    .send({
      title,
      price,
    })
    .expect(StatusCodes.CREATED);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
