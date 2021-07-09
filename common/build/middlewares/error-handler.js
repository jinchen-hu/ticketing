"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
var custom_error_1 = require("../errors/custom-error");
var http_status_codes_1 = require("http-status-codes");
var errorHandler = function (err, req, res, _next) {
    if (err instanceof custom_error_1.CustomError) {
        console.error(err);
        return res.status(err.statusCode).send({ errors: err.serializeErrors() });
    }
    console.error(err);
    res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send({
        message: err.message,
    });
};
exports.errorHandler = errorHandler;
