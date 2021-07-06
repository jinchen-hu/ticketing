import { TicketCreatedListener } from "../ticket-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedEvent } from "@luketicketing/common/build";
import mongoose, { set } from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket, TicketDoc } from "../../../model/ticket";

const setup = async () => {
  //create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);
  //create a fake data event
  const data: TicketCreatedEvent["data"] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 14,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("creates and saves a ticket", async () => {
  const { listener, data, msg } = await setup();
  //call the onMessage
  await listener.onMessage(data, msg);
  //writer assertions to make sure the ticket was created
  const ticket: TicketDoc | null = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
  expect(ticket!.version).toEqual(data.version);
});

it("acknowledges the message", async () => {
  const { listener, data, msg } = await setup();
  //call the onMessage
  await listener.onMessage(data, msg);

  expect(msg.ack).toBeCalled();
});
