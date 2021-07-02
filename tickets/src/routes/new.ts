import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  DatabaseConnectionError,
  requireAuth,
  validateRequest,
} from "@luketicketing/common/build";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";

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

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });

    try {
      await ticket.save();
    } catch (e) {
      throw new DatabaseConnectionError();
    }

    res.status(StatusCodes.CREATED).send(ticket);
  }
);

export { router as createTicketRouter };
