import { CustomError } from "./custom-error";
export declare class DatabaseConnectionError extends CustomError {
    constructor();
    readonly statusCode: number;
    readonly reason: string;
    serializeErrors(): {
        message: string;
    }[];
}
