import nats, { Stan } from "node-nats-streaming";
import { randomBytes } from "crypto";
import TicketCreatedListener from "./events/ticket-created-listener";

// client id must be distinct
const stan: Stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  stan.on("close", () => {
    console.log("NATS connection closed");
    process.exit();
  });

  const ticketCreatedListener: TicketCreatedListener =
    new TicketCreatedListener(stan);

  ticketCreatedListener.listen();
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
