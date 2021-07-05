import {
  OrderCreatedEvent,
  Publisher,
  Subjects,
} from "@luketicketing/common/build";
import { Stan } from "node-nats-streaming";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.ORDER_CREATED = Subjects.ORDER_CREATED;
  constructor(client: Stan) {
    super(client);
  }
}
