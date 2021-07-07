import {
  Listener,
  Subjects,
  ExpirationCompletedEvent,
  NotFoundError,
  OrderStatus,
} from "@luketicketing/common";
import { queueGroupName } from "./queue-group-name";
import { Message, Stan } from "node-nats-streaming";
import { Order, OrderDoc } from "../../model/order";
import { OrderCancelledPublisher } from "../publisher/order-cancelled-publisher";

export class ExpirationCompletedListener extends Listener<ExpirationCompletedEvent> {
  subject: Subjects.EXPIRATION_COMPLETED = Subjects.EXPIRATION_COMPLETED;
  queueGroupName = queueGroupName;

  constructor(client: Stan) {
    super(client);
  }

  async onMessage(data: ExpirationCompletedEvent["data"], msg: Message) {
    const order: OrderDoc | null =
      (await Order.findById(data.orderId).populate("ticket")) || null;

    if (!order || !order.ticket) {
      throw new NotFoundError();
    }

    if (order.status === OrderStatus.COMPLETED) {
      return msg.ack();
    }

    order.set({ status: OrderStatus.CANCELLED });
    await order.save();
    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    msg.ack();
  }
}
