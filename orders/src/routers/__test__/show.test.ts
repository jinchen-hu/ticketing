import request from "supertest";
import { Ticket, TicketDoc } from "../../model/ticket";
import { getMockCookie } from "../../test/setup";
import app from "../../app";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

it("fetch the order", async () => {
  const ticket: TicketDoc = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const user = getMockCookie();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id });

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(StatusCodes.OK);

  expect(fetchedOrder.id).toEqual(order.id);
});
