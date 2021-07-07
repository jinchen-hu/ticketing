import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket, TicketDoc } from "../../../models/ticket";
import mongoose from "mongoose";
import { OrderCreatedEvent, OrderStatus } from "@luketicketing/common/build";
import { Message } from "node-nats-streaming";

const setup = async () => {
  //create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // create an save a ticket
  const ticket: TicketDoc | null = Ticket.build({
    title: "concert",
    price: 24,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket!.save();

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: ticket!.version,
    status: OrderStatus.CREATED,
    userId: ticket!.userId,
    expiresAt: "not set",
    ticket: {
      id: ticket!.id,
      price: ticket!.price,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it("sets the user id of the ticket", async () => {
  const { listener, ticket, data, msg } = await setup();

  expect(ticket.orderId).not.toBeDefined();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it("acknowledges the message", async () => {
  const { listener, ticket, data, msg } = await setup();

  expect(ticket.orderId).not.toBeDefined();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);

  expect(msg.ack).toBeCalled();
});

it("should publish a ticket updated event", async () => {
  const { listener, ticket, data, msg } = await setup();

  expect(ticket.orderId).not.toBeDefined();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toBeCalled();

  // @ts-ignore
  const ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(data.id).toEqual(ticketUpdatedData.orderId);
});
