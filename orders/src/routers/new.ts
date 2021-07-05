import {
  BadRequestError,
  DatabaseConnectionError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@luketicketing/common/build";
import { Request, Response, Router } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";

import { Ticket, TicketDoc } from "../model/ticket";
import { Order, OrderDoc } from "../model/order";

const router = Router();

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => {
        mongoose.Types.ObjectId.isValid(input); // make sure the ticket id is a valid mongodb id
      })
      .withMessage("TicketId must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // find the ticket
    const { ticketId } = req.body;
    let ticket: TicketDoc | null = null;
    try {
      ticket = await Ticket.findById(ticketId);
    } catch (e) {
      console.log(e);
    }

    if (!ticket) {
      throw new NotFoundError();
    }

    // check if the ticket is reserved
    // run query to look at all orders to find the associated order which is not cancelled
    // such kind of order means the ticket is reserved
    let existingOrder: OrderDoc | null = null;
    try {
      existingOrder = await Order.findOne({
        ticket: ticket,
        status: {
          $in: [
            OrderStatus.CREATED,
            OrderStatus.AWAITING_PAYMENT,
            OrderStatus.COMPLETED,
          ],
        },
      });
    } catch (e) {
      throw new DatabaseConnectionError();
    }

    if (existingOrder) {
      throw new BadRequestError("The ticket has been reserved");
    }

    // calculate the expiration date

    // create the order

    // associate the ticket with the order and save to the DB

    // publish an event

    res.send({});
  }
);

export { router as createOrderRouter };
