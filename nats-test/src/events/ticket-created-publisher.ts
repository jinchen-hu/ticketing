import { Publisher } from "./base-publisher";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from "./subjects";
import { Stan } from "node-nats-streaming";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: TicketCreatedEvent["subject"] = Subjects.TICKET_CREATED;

  constructor(client: Stan) {
    super(client);
  }
}
