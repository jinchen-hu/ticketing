import "express-async-errors";
import mongoose from "mongoose";
import app from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  try {
    await mongoose.connect("mongodb://ticketing-auth-mongo-srv:27017/auth", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: true,
    });
    console.log("Connected to MongoDB");
    app.listen(3000, () => {
      console.log("Auth listening on port 3000!!!");
    });
  } catch (e) {
    console.log(e);
  }
};

start().catch(() => {
  console.log("Failed to start");
});
