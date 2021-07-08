import {
  Listener,
  PaymentCreatedEvent,
  Subjects,
  NotFoundError,
  OrderStatus,
} from "@luketicketing/common";
import { queueGroupName } from "./queue-group-name";
import { Message, Stan } from "node-nats-streaming";
import { Order, OrderDoc } from "../../model/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PAYMENT_CREATED = Subjects.PAYMENT_CREATED;
  queueGroupName = queueGroupName;

  constructor(client: Stan) {
    super(client);
  }

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    const order: OrderDoc | null = await Order.findById(data.orderId);

    if (!order) {
      throw new NotFoundError();
    }

    order.set({ status: OrderStatus.COMPLETED });

    await order.save();

    msg.ack();
  }
}
