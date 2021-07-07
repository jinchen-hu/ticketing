import { Ticket, TicketDoc } from "../../model/ticket";
import { getMockCookie } from "../../test/setup";
import app from "../../app";
import request from "supertest";
import { OrderStatus } from "@luketicketing/common";
import { natsWrapper } from "../../nats-wrapper";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

it("marks an order as cancelled", async () => {
  // create a ticket with Ticket model
  const ticket: TicketDoc = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Concert",
    price: 32,
  });
  await ticket.save();
  const user = getMockCookie();

  // make a request to create an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id });

  // make a request to cancel the order
  const { body: cancelledOrder } = await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send({});

  expect(cancelledOrder.status).toEqual(OrderStatus.CANCELLED);
});

it("emits a order cancelled event", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Concert",
    price: 32,
  });
  await ticket.save();
  const user = getMockCookie();

  // make a request to create an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id });
  // make a request to cancel the order
  await request(app).delete(`/api/orders/${order.id}`).set("Cookie", user);

  expect(natsWrapper.client.publish).toBeCalled();
});
