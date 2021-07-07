import { Subjects, TicketCreatedEvent, Listener } from "@luketicketing/common";
import { Message, Stan } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket, TicketDoc } from "../../model/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TICKET_CREATED = Subjects.TICKET_CREATED;
  queueGroupName: string = queueGroupName;

  constructor(client: Stan) {
    super(client);
  }

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { title, price, id } = data;
    const ticket: TicketDoc = Ticket.build({
      id,
      title,
      price,
    });

    await ticket.save();
    msg.ack();
  }
}
