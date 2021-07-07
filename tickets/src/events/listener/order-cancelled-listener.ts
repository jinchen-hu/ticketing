import Listener from "@luketicketing/common/build/events/base-listener";
import {
  NotFoundError,
  OrderCancelledEvent,
  Subjects,
} from "@luketicketing/common/build";
import { queueGroupName } from "./queue-group-name";
import { Message, Stan } from "node-nats-streaming";
import { Ticket, TicketDoc } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.ORDER_CANCELLED = Subjects.ORDER_CANCELLED;
  queueGroupName: string = queueGroupName;
  constructor(client: Stan) {
    super(client);
  }
  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const ticket: TicketDoc | null =
      (await Ticket.findById(data.ticket.id)) || null;

    if (!ticket) {
      throw new NotFoundError();
    }

    ticket.set({ orderId: undefined });
    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      orderId: ticket.orderId,
      version: ticket.version,
      userId: ticket.userId,
    });

    msg.ack();
  }
}
