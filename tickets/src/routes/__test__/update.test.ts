import request from "supertest";
import app from "../../app";
import { fakeTicketId, getMockCookie } from "../../test/setup";
import { StatusCodes } from "http-status-codes";
import { raw } from "express";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

it("returns 404 if the provided id does not exist", async () => {
  const title = "Test title";
  const price = 20;

  await request(app)
    .put(`/api/tickets/${fakeTicketId}`)
    .set("Cookie", getMockCookie())
    .send({
      title,
      price,
    })
    .expect(StatusCodes.NOT_FOUND);
});

it("returns 401 if user is not authenticated", async () => {
  const title = "Test title";
  const price = 20;

  await request(app)
    .put(`/api/tickets/${fakeTicketId}`)
    .send({
      title,
      price,
    })
    .expect(StatusCodes.UNAUTHORIZED);
});

it("returns 401 if user does not own the ticket", async () => {
  const title = "Test title";
  const price = 20;

  const response = await request(app)
    .post("/api/tickets/")
    .set("Cookie", getMockCookie())
    .send({
      title,
      price,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", getMockCookie())
    .send({
      title: "New Title",
      price: 200,
    })
    .expect(StatusCodes.UNAUTHORIZED);
});

it("returns 401 if invalid title or price is provided", async () => {
  const title = "Test title";
  const price = 20;
  const cookie = getMockCookie();
  const response = await request(app)
    .post("/api/tickets/")
    .set("Cookie", cookie)
    .send({
      title,
      price,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      price: 200,
    })
    .expect(StatusCodes.BAD_REQUEST);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 10,
    })
    .expect(StatusCodes.BAD_REQUEST);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "New title",
      price: -1,
    })
    .expect(StatusCodes.BAD_REQUEST);
});

it("updates ticket with valid inputs", async () => {
  const title = "Test title";
  const price = 20;
  const cookie = getMockCookie();
  const response = await request(app)
    .post("/api/tickets/")
    .set("Cookie", cookie)
    .send({
      title,
      price,
    });

  const newTitle = "New Title";
  const newPrice = 24;

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: newTitle,
      price: newPrice,
    })
    .expect(StatusCodes.OK);

  const getTicket = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send({})
    .expect(StatusCodes.OK);

  expect(getTicket.body.title).toEqual(newTitle);
  expect(getTicket.body.price).toEqual(newPrice);
});

it("publishes an update event", async () => {
  const title = "Montreal";
  const price = 25;
  const cookie = getMockCookie();
  const response = await request(app)
    .post("/api/tickets/")
    .set("Cookie", cookie)
    .send({
      title,
      price,
    });

  const newTitle = "New Title";
  const newPrice = 24;

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: newTitle,
      price: newPrice,
    })
    .expect(StatusCodes.OK);

  const getTicket = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send({})
    .expect(StatusCodes.OK);

  expect(getTicket.body.title).toEqual(newTitle);
  expect(getTicket.body.price).toEqual(newPrice);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("rejects updates if the ticket is reserved", async () => {
  const title = "Montreal";
  const price = 25;
  const cookie = getMockCookie();
  const response = await request(app)
    .post("/api/tickets/")
    .set("Cookie", cookie)
    .send({
      title,
      price,
    });

  const ticket = (await Ticket.findById(response.body.id)) || null;
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  const newTitle = "New Title";
  const newPrice = 24;

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: newTitle,
      price: newPrice,
    })
    .expect(StatusCodes.BAD_REQUEST);
});
