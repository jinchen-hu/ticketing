import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorized,
} from "@luketicketing/common";
import { StatusCodes } from "http-status-codes";
import { OrderDoc, Order } from "../model/order";
import { OrderStatus } from "@luketicketing/common/build";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [
    body("token").not().isEmpty().withMessage("Token must be provided"),
    body("orderId").not().isEmpty().withMessage("Order id must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order: OrderDoc | null = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorized();
    }

    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestError("The order is cancelled");
    }

    res.status(StatusCodes.CREATED).send({ success: true });
  }
);

export { router as ChargeCreatedRouter };
