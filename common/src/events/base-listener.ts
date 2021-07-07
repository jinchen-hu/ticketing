import { Message, Stan, SubscriptionOptions } from "node-nats-streaming";
import Buffer from "buffer";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}

abstract class Listener<T extends Event> {
  abstract subject: T["subject"];
  abstract queueGroupName: string;
  abstract onMessage(data: T["data"], msg: Message): void;

  protected client: Stan;
  protected ackWait = 5 * 1000;

  protected constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions(): SubscriptionOptions {
    // the subscriber/consumer will not acknowledge the event
    // until we set the ask() method on the message
    // the nats-streaming-server will redelivery the event after 5s
    // if the event is not acknowledged
    return this.client
      .subscriptionOptions()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDeliverAllAvailable() // get all available events at the very first time
      .setDurableName(this.queueGroupName);
    // queue group will make sure that all instances of the same service
    // will receive the message/event exactly once
  }

  listen(): void {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on("message", (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);
      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data: String | Buffer = msg.getData();

    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf-8"));
  }
}

export default Listener;
