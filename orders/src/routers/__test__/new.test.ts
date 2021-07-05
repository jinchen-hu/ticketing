import mongoose from "mongoose";
import request from "supertest";
import app from "../../app";
import { getMockCookie } from "../../test/setup";
import { StatusCodes } from "http-status-codes";
import { Ticket, TicketDoc } from "../../model/ticket";
import { OrderStatus } from "@luketicketing/common/build";
import { OrderDoc, Order } from "../../model/order";
import { natsWrapper } from "../../nats-wrapper";

it("returns an error if the ticket does not exist", async () => {
  const ticketId = mongoose.Types.ObjectId();

  await request(app)
    .post("/api/order")
    .set("Cookie", getMockCookie())
    .send({ ticketId })
    .expect(StatusCodes.NOT_FOUND);
});

it("returns an error if the ticket has been reserved", async () => {
  const ticket: TicketDoc = Ticket.build({
    title: "concert",
    price: 20,
  });

  await ticket.save();

  const order: OrderDoc = Order.build({
    ticket,
    userId: "33333",
    status: OrderStatus.CREATED,
    expiresAt: new Date(),
  });

  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", getMockCookie())
    .send({ ticketId: ticket.id })
    .expect(StatusCodes.BAD_REQUEST);
});

it("reserves an ticket successfully", async () => {
  const ticket: TicketDoc = Ticket.build({
    //id: mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const numberOfTickets = await Ticket.count();

  expect(numberOfTickets).toEqual(1);

  await request(app)
    .post("/api/orders")
    .set("Cookie", getMockCookie())
    .send({ ticketId: ticket.id })
    .expect(StatusCodes.CREATED);
});

//TODO: 1. auth test  2. input test

it("emit a create order event", async () => {
  const ticket: TicketDoc = Ticket.build({
    //id: mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const numberOfTickets = await Ticket.count();

  expect(numberOfTickets).toEqual(1);

  await request(app)
    .post("/api/orders")
    .set("Cookie", getMockCookie())
    .send({ ticketId: ticket.id })
    .expect(StatusCodes.CREATED);

  expect(natsWrapper.client.publish).toBeCalled();
});
