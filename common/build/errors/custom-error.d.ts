export declare abstract class CustomError extends Error {
    readonly message: string;
    abstract statusCode: number;
    protected constructor(message: string);
    abstract serializeErrors(): {
        message: string;
        field?: string;
    }[];
}
