"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatus = void 0;
var OrderStatus;
(function (OrderStatus) {
    // when hte order has been created but ticket is trying to be reserved
    OrderStatus["CREATED"] = "created";
    // ticket is reserved or the user cancelled the order
    // the order expires before payment
    OrderStatus["CANCELLED"] = "cancelled";
    // order reserved the ticket and wait for the paymemt
    OrderStatus["AWAITING_PAYMENT"] = "awaiting:payment";
    // user successfully completed the payment
    OrderStatus["COMPLETED"] = "completed";
})(OrderStatus = exports.OrderStatus || (exports.OrderStatus = {}));
