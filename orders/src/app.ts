import express, { NextFunction } from "express";
import "express-async-errors";
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from "@luketicketing/common";
import cookieSession from "cookie-session";
import { deleteOrderRouter } from "./routers/delete";
import { createOrderRouter } from "./routers/new";
import { showOrderRouter } from "./routers/show";
import { indexOrderRouter } from "./routers";

const app = express();
app.set("trust proxy", 1);
app.use(express.json());

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

console.log("NODE ENV: ", process.env.NODE_ENV);

app.use(currentUser);

app.use(deleteOrderRouter);
app.use(createOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);

app.all("*", async (_req, _res, _next: NextFunction) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export default app;
