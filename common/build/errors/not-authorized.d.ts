import { CustomError } from "./custom-error";
import { StatusCodes } from "http-status-codes";
export declare class NotAuthorized extends CustomError {
    readonly statusCode = StatusCodes.UNAUTHORIZED;
    serializeErrors(): {
        message: string;
        field?: string;
    }[];
    constructor();
}
