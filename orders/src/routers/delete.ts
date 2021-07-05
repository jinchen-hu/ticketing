import { Request, Response, Router } from "express";
import {
  NotAuthorized,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from "@luketicketing/common/build";
import { Order, OrderDoc } from "../model/order";
import { StatusCodes } from "http-status-codes";

const router = Router();

// TODO: check id type, or use PATCH/PUT
router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order: OrderDoc | null = (await Order.findById(orderId)) || null;

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorized();
    }

    order.status = OrderStatus.CANCELLED;

    await order.save();

    res.status(StatusCodes.NO_CONTENT).send(order);
  }
);

export { router as deleteOrderRouter };
