import "express-async-errors";
import mongoose from "mongoose";
import app from "./app";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URL must be defined");
  }

  try {
    await natsWrapper.connect(
      "ticketing",
      "abbbb",
      "http://ticketing-nats-srv:4222"
    );

    natsWrapper.client.on("close", () => {
      console.log("NATS connects closed");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: true,
    });
    console.log("Connected to MongoDB");
    app.listen(3000, () => {
      console.log("Tickets listening on port 3000!!!");
    });
  } catch (e) {
    console.log(e);
  }
};

start().catch(() => {
  console.log("Failed to start");
});
