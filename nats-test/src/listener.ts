import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

// client id must be distinct
const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  stan.on("close", () => {
    console.log("NATS connection closed");
    process.exit();
  });

  // the subscriber/consumer will not acknowledge the event
  // until we set the ask() method on the message
  // the nats-streaming-server will redelivery the event after 5s
  // if the event is not acknowledged
  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setAckWait(5 * 1000);
  // queue group will make sure that all instances of the same service
  // will receive the message/event exactly once
  const subscription = stan.subscribe(
    "ticket:created",
    "orders-service-queue-group",
    options
  );

  subscription.on("message", (msg: Message) => {
    const data: String | Buffer = msg.getData();
    if (typeof data === "string") {
      console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    }

    // acknowledge the event after it was processed
    msg.ack();
  });
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
