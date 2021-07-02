import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";
import { StatusCodes } from "http-status-codes";
export declare class RequestValidationError extends CustomError {
    private errors;
    readonly statusCode = StatusCodes.BAD_REQUEST;
    constructor(errors: ValidationError[]);
    serializeErrors(): {
        message: any;
        field: string;
    }[];
}
