import { Subjects } from "./subjects";

export interface OrderCancelledEvent {
  subject: Subjects.ORDER_CANCELLED;
  data: {
    id: string;
    ticket: {
      id: string;
    };
  };
}
