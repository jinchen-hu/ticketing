import { CustomError } from "./custom-error";
import { StatusCodes } from "http-status-codes";

export class BadRequestError extends CustomError {
  readonly statusCode = StatusCodes.BAD_REQUEST;
  constructor(readonly message: string) {
    super(message);
  }
  serializeErrors(): { message: string; field?: string }[] {
    return [{ message: this.message }];
  }
}
