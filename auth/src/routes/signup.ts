import express, { Request, Response } from "express";
import { body } from "express-validator";
import { DatabaseConnectionError } from "../errors/database-connection-error";
import { BadRequestError } from "../errors/bad-request-error";
import { User } from "../models/user";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { validateRequest } from "../middlewares/validate-request";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      //console.error("Email in use");
      throw new BadRequestError("Email in use");
    }

    const user = User.build({ email, password });
    await user.save().catch(() => {
      throw new DatabaseConnectionError();
    });

    //generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    req.session = { jwt: userJwt };

    res.status(StatusCodes.CREATED).send(user);
  }
);

export { router as signupRouter };
