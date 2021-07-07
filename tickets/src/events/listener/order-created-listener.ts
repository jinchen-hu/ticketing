import Listener from "@luketicketing/common/build/events/base-listener";
import {
  NotFoundError,
  OrderCreatedEvent,
  Subjects,
} from "@luketicketing/common/build";
import { queueGroupName } from "./queue-group-name";
import { Message, Stan } from "node-nats-streaming";
import { Ticket, TicketDoc } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.ORDER_CREATED = Subjects.ORDER_CREATED;
  queueGroupName: string = queueGroupName;

  constructor(client: Stan) {
    super(client);
  }

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    // find the ticket that the order is reserving
    const ticket: TicketDoc | null = await Ticket.findById(data.ticket.id);

    // if not found, throw error
    if (!ticket) {
      throw new NotFoundError();
    }

    // else, update the order id to indicate the ticket is being reserved
    ticket.set({ orderId: data.id });
    await ticket.save();

    // TODO: lodash
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });
    msg.ack();
  }
}
