import request from "supertest";
import { Ticket, TicketDoc } from "../../model/ticket";
import { getMockCookie } from "../../test/setup";
import app from "../../app";
import { StatusCodes } from "http-status-codes";

it("fetch the order", async () => {
  const ticket: TicketDoc = Ticket.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const user = getMockCookie();

  await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketID: ticket.id })
    .expect(StatusCodes.CREATED);
});
