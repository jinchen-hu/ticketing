import request from "supertest";
import app from "../../app";
import { Ticket } from "../../model/ticket";
import { getMockCookie } from "../../test/setup";
import { StatusCodes } from "http-status-codes";

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 10,
  });

  await ticket.save();
  return ticket;
};

it("fetches orders for a particular user", async () => {
  const ticket1 = await buildTicket();
  const ticket2 = await buildTicket();
  const ticket3 = await buildTicket();

  const user1 = getMockCookie();
  const user2 = getMockCookie();

  await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({ ticketId: ticket1.id })
    .expect(StatusCodes.CREATED);

  await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({ ticketId: ticket2.id })
    .expect(StatusCodes.CREATED);

  await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({ ticketId: ticket3.id })
    .expect(StatusCodes.CREATED);
});
