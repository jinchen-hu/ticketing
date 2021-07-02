import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";
import { StatusCodes } from "http-status-codes";

export class RequestValidationError extends CustomError {
  readonly statusCode = StatusCodes.BAD_REQUEST;

  constructor(private errors: ValidationError[]) {
    super("Invalid request parameters");
    //Object.setPrototypeOf(this, new.target.prototype);
  }

  serializeErrors() {
    return this.errors.map((err) => {
      return { message: err.msg, field: err.param };
    });
  }
}
