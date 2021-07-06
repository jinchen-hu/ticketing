import { Request, Response, Router } from "express";
import {
  NotAuthorized,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from "@luketicketing/common/build";
import { Order, OrderDoc } from "../model/order";
import { OrderCancelledPublisher } from "../events/publisher/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

// TODO: check id type, or use PATCH/PUT
router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const cancelledOrder: OrderDoc | null =
      (await Order.findById(orderId).populate("ticket")) || null;

    if (!cancelledOrder) {
      throw new NotFoundError();
    }

    if (cancelledOrder.userId !== req.currentUser!.id) {
      throw new NotAuthorized();
    }

    cancelledOrder.status = OrderStatus.CANCELLED;

    await cancelledOrder.save();

    await new OrderCancelledPublisher(natsWrapper.client).publish({
      id: cancelledOrder.id,
      ticket: {
        id: cancelledOrder.ticket.id,
      },
    });

    res.send(cancelledOrder);
  }
);

export { router as deleteOrderRouter };
