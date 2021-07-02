import { CustomError } from "./custom-error";
import { StatusCodes } from "http-status-codes";

export class NotFoundError extends CustomError {
  readonly statusCode = StatusCodes.NOT_FOUND;

  constructor() {
    super("Route not found");
  }

  serializeErrors(): { message: string; field?: string }[] {
    return [{ message: "Not Found" }];
  }
}
