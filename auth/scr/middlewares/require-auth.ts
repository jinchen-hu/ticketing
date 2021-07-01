import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { NotAuthorized } from "../errors/not-authorized";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    throw new NotAuthorized();
  }
  next();
};
