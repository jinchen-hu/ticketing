import { Response, Request, Router } from "express";
import { requireAuth } from "@luketicketing/common/build";
import { Order } from "../model/order";

const router = Router();

router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({ userId: req.currentUser!.id }).populate(
    "ticket"
  );

  res.send(orders);
});

export { router as indexOrderRouter };
