import { CustomError } from "./custom-error";
import { StatusCodes } from "http-status-codes";
export declare class BadRequestError extends CustomError {
    readonly message: string;
    readonly statusCode = StatusCodes.BAD_REQUEST;
    constructor(message: string);
    serializeErrors(): {
        message: string;
        field?: string;
    }[];
}
