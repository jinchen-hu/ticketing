import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  DatabaseConnectionError,
  NotAuthorized,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@luketicketing/common/build";
import { Ticket } from "../models/ticket";

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
    let ticket;
    try {
      ticket = await Ticket.findById(req.params.id);
    } catch (e) {
      console.log(e);
      throw new DatabaseConnectionError();
    }

    if (!ticket) {
      throw new NotFoundError();
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
    } catch (e) {
      throw new DatabaseConnectionError();
    }

    res.send(ticket);
  }
);

export { router as updateTicketRouter };