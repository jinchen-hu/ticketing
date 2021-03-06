import express, { NextFunction } from "express";
import "express-async-errors";
import { currentUserRouter } from "./routes/current-user";
import { signoutRouter } from "./routes/signout";
import { signinRouter } from "./routes/signin";
import { signupRouter } from "./routes/signup";
import { errorHandler, NotFoundError } from "@luketicketing/common";
import cookieSession from "cookie-session";

const app = express();
app.set("trust proxy", 1);
app.use(express.json());

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUserRouter);
app.use(signupRouter);
app.use(signoutRouter);
app.use(signinRouter);

app.all("*", async (_req, _res, _next: NextFunction) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export default app;
