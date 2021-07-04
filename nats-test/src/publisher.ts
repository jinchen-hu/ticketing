import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

// client id must be unique
const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  console.log("Publisher connected to NATS");

  const data = {
    id: "123",
    title: "connect",
    price: 20,
  };
  const ticketCreatedPublisher = new TicketCreatedPublisher(stan);

  await ticketCreatedPublisher.publish(data).catch((e) => {
    console.log(e);
  });
});
