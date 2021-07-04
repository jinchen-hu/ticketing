import { Message, Stan } from "node-nats-streaming";
import Listener from "./base-listener";
import { Subjects } from "./subjects";
import { TicketCreatedEvent } from "./ticket-created-event";

class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject: TicketCreatedEvent["subject"] = Subjects.TICKET_CREATED;
  readonly queueGroupName: string = "payments-service";

  constructor(client: Stan) {
    super(client);
  }

  onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    console.log(`NO. ${msg.getSequence()}, Event data: `, data);
    msg.ack();
  }
}

export default TicketCreatedListener;
