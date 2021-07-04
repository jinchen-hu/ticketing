import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

// client id must be distinct
const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  const subscription = stan.subscribe("ticket:created");

  subscription.on("message", (msg: Message) => {
    const data: String | Buffer = msg.getData();
    if (typeof data === "string") {
      console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    }
  });
});
