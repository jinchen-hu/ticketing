import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  DatabaseConnectionError,
  NotAuthorized,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@luketicketing/common";
import { Ticket, TicketDoc } from "../models/ticket";
import { TicketUpdatedPublisher } from "../events/publisher/ticket-updated-publisher";
import { natsWrapper } from "../nats-wrapper";
import { BadRequestError } from "@luketicketing/common/build";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket: TicketDoc | null = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.orderId) {
      throw new BadRequestError("The ticket is being reserved");
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorized();
    }

    try {
      ticket.set({
        title: req.body.title,
        price: req.body.price,
      });
      await ticket.save();

      await new TicketUpdatedPublisher(natsWrapper.client).publish({
        title: ticket.title,
        price: ticket.price,
        id: ticket.id,
        userId: ticket.userId,
        version: ticket.version,
      });
    } catch (e) {
      throw new DatabaseConnectionError();
    }

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
