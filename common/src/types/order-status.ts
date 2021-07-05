export enum OrderStatus {
  // when hte order has been created but ticket is trying to be reserved
  CREATED = "created",
  // ticket is reserved or the user cancelled the order
  // the order expires before payment
  CANCELLED = "cancelled",
  // order reserved the ticket and wait for the paymemt
  AWAITING_PAYMENT = "awaiting:payment",
  // user successfully completed the payment
  COMPLETED = "completed",
}
