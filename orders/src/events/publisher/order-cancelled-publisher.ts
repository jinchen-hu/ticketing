import {
  OrderCancelledEvent,
  Publisher,
  Subjects,
} from "@luketicketing/common/build";
import { Stan } from "node-nats-streaming";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.ORDER_CANCELLED = Subjects.ORDER_CANCELLED;

  constructor(client: Stan) {
    super(client);
  }
}
