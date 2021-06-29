import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-error";
import { StatusCodes } from "http-status-codes";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }
  res.status(StatusCodes.BAD_REQUEST).send({
    message: err.message,
  });
};
