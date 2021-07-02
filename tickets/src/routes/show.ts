import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import { NotFoundError } from "@luketicketing/common/build";

const router = express.Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  let ticket;
  try {
    ticket = await Ticket.findById(req.params.id);
  } catch (e) {
    console.log(e);
    throw new NotFoundError();
  }

  if (!ticket) {
    throw new NotFoundError();
  }

  res.send(ticket);
});

export { router as showTicketRouter };
