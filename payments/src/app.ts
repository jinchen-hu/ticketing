import express, { NextFunction } from "express";
import "express-async-errors";
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from "@luketicketing/common";
import cookieSession from "cookie-session";
import { ChargeCreatedRouter } from "./routes/new";

const app = express();
app.set("trust proxy", 1);
app.use(express.json());

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUser);
app.use(errorHandler);

app.use(ChargeCreatedRouter);

app.all("*", async (_req, _res, _next: NextFunction) => {
  throw new NotFoundError();
});

export default app;
