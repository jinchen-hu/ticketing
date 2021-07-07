import {
  NotFoundError,
  Subjects,
  Listener,
  TicketUpdatedEvent,
} from "@luketicketing/common";
import { queueGroupName } from "./queue-group-name";
import { Message, Stan } from "node-nats-streaming";
import { Ticket, TicketDoc } from "../../model/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TICKET_UPDATED = Subjects.TICKET_UPDATED;
  queueGroupName: string = queueGroupName;

  constructor(client: Stan) {
    super(client);
  }
  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const ticket: TicketDoc | null = (await Ticket.findByEvent(data)) || null;
    if (!ticket) {
      throw new NotFoundError();
    }

    const { title, price } = data;
    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
