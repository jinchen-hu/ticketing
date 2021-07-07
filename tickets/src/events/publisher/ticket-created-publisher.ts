import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from "@luketicketing/common";
import { Stan } from "node-nats-streaming";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: TicketCreatedEvent["subject"] = Subjects.TICKET_CREATED;
  constructor(client: Stan) {
    super(client);
  }
}
