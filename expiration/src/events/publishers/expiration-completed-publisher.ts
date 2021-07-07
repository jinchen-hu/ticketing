import {
  Publisher,
  ExpirationCompletedEvent,
  Subjects,
} from "@luketicketing/common";
import { Stan } from "node-nats-streaming";

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompletedEvent> {
  subject: Subjects.EXPIRATION_COMPLETED = Subjects.EXPIRATION_COMPLETED;
  constructor(client: Stan) {
    super(client);
  }
}
