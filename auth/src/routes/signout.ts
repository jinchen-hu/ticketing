import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const router = express.Router();

router.post("/api/users/signout", (req: Request, res: Response) => {
  req.session = null;

  res.status(StatusCodes.OK).send({});
});

export { router as signoutRouter };
