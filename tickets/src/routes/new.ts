import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  DatabaseConnectionError,
  requireAuth,
  validateRequest,
} from "@luketicketing/common";
import { body } from "express-validator";
import { Ticket, TicketDoc } from "../models/ticket";
import { TicketCreatedPublisher } from "../events/publisher/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket: TicketDoc = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });

    try {
      await ticket.save();
      await new TicketCreatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
      });
    } catch (e) {
      throw new DatabaseConnectionError();
    }

    res.status(StatusCodes.CREATED).send(ticket);
  }
);

export { router as createTicketRouter };
