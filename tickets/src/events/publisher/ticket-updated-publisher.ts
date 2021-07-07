import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from "@luketicketing/common";
import { Stan } from "node-nats-streaming";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: TicketUpdatedEvent["subject"] = Subjects.TICKET_UPDATED;
  constructor(client: Stan) {
    super(client);
  }
}
