import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import { DatabaseConnectionError } from "@luketicketing/common";

const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
  let tickets;
  try {
    tickets = await Ticket.find({});
  } catch (e) {
    console.error(e);
    throw new DatabaseConnectionError();
  }

  res.send(tickets);
});

export { router as indexTicketRouter };
