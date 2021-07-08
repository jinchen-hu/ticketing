import {
  Publisher,
  PaymentCreatedEvent,
  Subjects,
} from "@luketicketing/common";
import { Stan } from "node-nats-streaming";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PAYMENT_CREATED = Subjects.PAYMENT_CREATED;
  constructor(client: Stan) {
    super(client);
  }
}
