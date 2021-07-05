import {
  BadRequestError,
  DatabaseConnectionError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@luketicketing/common";
import { Request, Response, Router } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";

import { Ticket, TicketDoc } from "../model/ticket";
import { Order } from "../model/order";
import { StatusCodes } from "http-status-codes";

const router = Router();

const EXPIRATION_WINDOW_SECONDS: number = 15 * 60;

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
    console.log("HI");
    const { ticketId } = req.body;
    let ticket: TicketDoc | null = null;
    try {
      ticket = await Ticket.findById(ticketId);
    } catch (e) {
      throw new DatabaseConnectionError();
    }
    console.log("HI");

    if (!ticket) {
      throw new NotFoundError();
    }

    // check if the ticket is reserved
    // run query to look at all orders to find the associated order which is not cancelled
    // such kind of order means the ticket is reserved
    let isReserved: boolean;
    try {
      isReserved = await ticket.isReserved();
    } catch (e) {
      throw new DatabaseConnectionError();
    }
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
      ticket: ticket.id,
    });

    try {
      await order.save();
    } catch (e) {
      throw new DatabaseConnectionError();
    }

    // associate the ticket with the order and save to the DB

    // publish an event

    res.status(StatusCodes.CREATED).send(order);
  }
);

export { router as createOrderRouter };
