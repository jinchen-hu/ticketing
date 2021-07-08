import { OrderCancelledEvent, OrderStatus } from "@luketicketing/common";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Order } from "../../../model/order";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: orderId,
    status: OrderStatus.CREATED,
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
  });

  await order.save();

  const data: OrderCancelledEvent["data"] = {
    id: orderId,
    version: 1,
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, data, msg };
};

it("should ", async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const cancelledOrder = await Order.findById(order.id);

  expect(cancelledOrder!.status).toEqual(OrderStatus.CANCELLED);

  expect(msg.ack).toBeCalled();
});
