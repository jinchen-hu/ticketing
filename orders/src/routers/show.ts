import { Response, Request, Router } from "express";
import {
  NotAuthorized,
  NotFoundError,
  requireAuth,
} from "@luketicketing/common";
import { Order, OrderDoc } from "../model/order";

const router = Router();

// TODO: validate id type
router.get(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const order: OrderDoc | null =
      (await Order.findById(req.params.orderId).populate("ticket")) || null;

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorized();
    }
    res.send(order);
  }
);

export { router as showOrderRouter };
