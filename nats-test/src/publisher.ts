import nats from "node-nats-streaming";

// client id must be unique
const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Publisher connected to NATS");

  const data = JSON.stringify({
    id: "123",
    title: "connect",
    price: 20,
  });

  stan.publish("ticket:created", data, (err, guid) => {
    console.log("Event published", guid);
  });
});
