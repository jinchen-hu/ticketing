import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
  constructor() {
    super("Error connecting to database");
    //Object.setPrototypeOf(this, new.target.prototype);
  }

  readonly statusCode: number = 500;
  readonly reason: string = "Error connecting to database";
  serializeErrors() {
    return [{ message: this.reason }];
  }
}
