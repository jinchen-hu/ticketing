import { OrderCreatedEvent, Subjects, Listener } from "@luketicketing/common";
import { queueGroupName } from "./queue-group-name";
import { Message, Stan } from "node-nats-streaming";
import expirationQueue from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.ORDER_CREATED = Subjects.ORDER_CREATED;
  queueGroupName: string = queueGroupName;
  constructor(client: Stan) {
    super(client);
  }

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay: 10000,
      }
    );

    msg.ack();
  }
}
