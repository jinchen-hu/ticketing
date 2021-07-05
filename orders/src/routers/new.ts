import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@luketicketing/common";
import { Request, Response, Router } from "express";
import { body } from "express-validator";

import { Ticket, TicketDoc } from "../model/ticket";
import { Order } from "../model/order";
import { StatusCodes } from "http-status-codes";
import { OrderCreatedPublisher } from "../events/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

const EXPIRATION_WINDOW_SECONDS: number = 15 * 60;

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .isMongoId()
      .withMessage("TicketId must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // find the ticket
    const { ticketId } = req.body;
    const ticket: TicketDoc | null = (await Ticket.findById(ticketId)) || null;

    if (!ticket) {
      throw new NotFoundError();
    }

    // check if the ticket is reserved
    // run query to look at all orders to find the associated order which is not cancelled
    // such kind of order means the ticket is reserved
    const isReserved = await ticket.isReserved();

    if (isReserved) {
      throw new BadRequestError("The ticket has been reserved");
    }

    // calculate the expiration date
    const expiration: Date = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // create the order
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.CREATED,
      expiresAt: expiration,
      ticket,
    });

    await order.save();
    ///publish an event
    await new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price,
      },
    });

    res.status(StatusCodes.CREATED).send(order);
  }
);

export { router as createOrderRouter };
