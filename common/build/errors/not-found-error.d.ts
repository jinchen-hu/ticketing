import { CustomError } from "./custom-error";
import { StatusCodes } from "http-status-codes";
export declare class NotFoundError extends CustomError {
    readonly statusCode = StatusCodes.NOT_FOUND;
    constructor();
    serializeErrors(): {
        message: string;
        field?: string;
    }[];
}
