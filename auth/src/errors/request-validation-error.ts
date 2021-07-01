import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
  readonly statusCode = 400;

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
