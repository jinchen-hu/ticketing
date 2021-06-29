import express, { NextFunction } from "express";
import "express-async-errors";
import { currentUserRouter } from "./routes/current-user";
import { signoutRouter } from "./routes/signout";
import { signinRouter } from "./routes/signin";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();
app.use(express.json());

app.use(currentUserRouter);
app.use(signupRouter);
app.use(signoutRouter);
app.use(signinRouter);

app.all("*", async (_req, _res, next: NextFunction) => {
  throw new NotFoundError();
});

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Auth listening on port 3000!!!");
});
