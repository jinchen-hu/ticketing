import { CustomError } from "./custom-error";
import { StatusCodes } from "http-status-codes";

export class NotAuthorized extends CustomError {
  readonly statusCode = StatusCodes.UNAUTHORIZED;

  serializeErrors(): { message: string; field?: string }[] {
    return [{ message: "Not Authorized" }];
  }

  constructor() {
    super("Not Authorized");
  }
}
