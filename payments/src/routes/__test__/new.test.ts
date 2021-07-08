import request from "supertest";
import app from "../../app";
import { getMockCookie } from "../../test/setup";
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import { Order } from "../../model/order";
import { OrderStatus } from "@luketicketing/common";
import { stripe } from "../../stripe";

jest.mock("../../stripe");
it("should throw 404 when purchasing an order not existing", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", getMockCookie())
    .send({
      token: "test token",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(StatusCodes.NOT_FOUND);
});

it("should throw 401 if the order does not belong to current user", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 200,
    version: 0,
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.CREATED,
  });
  await order.save();
  await request(app)
    .post("/api/payments")
    .set("Cookie", getMockCookie())
    .send({
      token: "test token",
      orderId: order.id,
    })
    .expect(StatusCodes.UNAUTHORIZED);
});

it("should throw 400 when the order is cancelled", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: orderId,
    price: 200,
    version: 1,
    userId,
    status: OrderStatus.CANCELLED,
  });
  await order.save();
  await request(app)
    .post("/api/payments")
    .set("Cookie", getMockCookie(userId))
    .send({
      token: "test token",
      orderId,
    })
    .expect(StatusCodes.BAD_REQUEST);
});

it("should return 201 with valid inputs", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: orderId,
    price: 200,
    version: 1,
    userId,
    status: OrderStatus.CREATED,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", getMockCookie(userId))
    .send({
      token: "tok_visa",
      orderId,
    })
    .expect(StatusCodes.CREATED);

  const chargeOptions = (stripe.charges?.create as jest.Mock).mock.calls[0][0];

  expect(chargeOptions).toEqual({
    source: "tok_visa",
    amount: 200 * 100,
    currency: "cad",
  });
  expect(stripe.charges?.create).toBeCalled();
});
