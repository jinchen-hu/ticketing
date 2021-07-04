import { Message, Stan } from "node-nats-streaming";
import Listener from "./base-listener";

class TicketCreatedListener extends Listener {
  subject: string = "ticket:created";
  queueGroupName: string = "payments-service";

  constructor(client: Stan) {
    super(client);
  }

  onMessage(data: any, msg: Message) {
    console.log(`Event data: ${data}, NO. ${msg.getSequence()}`);

    msg.ack();
  }
}

export default TicketCreatedListener;
