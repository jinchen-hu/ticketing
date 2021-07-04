import { Message, Stan, SubscriptionOptions } from "node-nats-streaming";
import { Subjects } from "./subjects";
interface Event {
    subject: Subjects;
    data: any;
}
declare abstract class Listener<T extends Event> {
    abstract subject: T["subject"];
    abstract queueGroupName: string;
    abstract onMessage(data: T["data"], msg: Message): void;
    private client;
    protected ackWait: number;
    protected constructor(client: Stan);
    subscriptionOptions(): SubscriptionOptions;
    listen(): void;
    parseMessage(msg: Message): any;
}
export default Listener;
