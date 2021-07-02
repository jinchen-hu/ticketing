export abstract class CustomError extends Error {
  abstract statusCode: number;

  protected constructor(readonly message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }

  abstract serializeErrors(): { message: string; field?: string }[];
}
