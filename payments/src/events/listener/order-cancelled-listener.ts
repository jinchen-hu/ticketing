import {
  Listener,
  OrderStatus,
  Subjects,
  OrderCancelledEvent,
} from "@luketicketing/common";
import { queueGroupName } from "./queue-group-name";
import { Message, Stan } from "node-nats-streaming";
import { Order, OrderDoc } from "../../model/order";
import { NotFoundError } from "@luketicketing/common/build";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.ORDER_CANCELLED = Subjects.ORDER_CANCELLED;

  queueGroupName = queueGroupName;
  constructor(client: Stan) {
    super(client);
  }

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const order: OrderDoc | null = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) {
      throw new NotFoundError();
    }

    order.set({ status: OrderStatus.CANCELLED });

    await order.save();
    msg.ack();
  }
}
