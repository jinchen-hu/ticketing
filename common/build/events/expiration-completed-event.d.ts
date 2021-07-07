import { Subjects } from "./subjects";
export interface ExpirationCompletedEvent {
    subject: Subjects.EXPIRATION_COMPLETED;
    data: {
        orderId: string;
    };
}
