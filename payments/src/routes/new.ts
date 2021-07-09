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
import { stripe } from "../stripe";
import { Payment, PaymentDoc } from "../model/payment";
import { PaymentCreatedPublisher } from "../events/publisher/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

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
      console.log("userId: ", order.userId);
      console.log("current id: ", req.currentUser!.id);
      throw new NotAuthorized();
    }

    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestError("The order is cancelled");
    }

    const charge = await stripe.charges?.create({
      currency: "cad",
      amount: order.price * 100,
      source: token,
    });

    const payment: PaymentDoc = Payment.build({
      orderId,
      stripeId: charge.id,
    });

    await payment.save();

    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(StatusCodes.CREATED).send({ id: payment.id });
  }
);

export { router as ChargeCreatedRouter };
