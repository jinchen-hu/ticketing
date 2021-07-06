import { Document, model, Model, Schema } from "mongoose";
import { Order, OrderDoc } from "./order";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@luketicketing/common/build";

export interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

export interface TicketDoc extends Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

export interface TicketModel extends Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TicketDoc | null>;
}

const ticketSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  });
};

ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

ticketSchema.methods.isReserved = async function () {
  const existingOrder: OrderDoc | null =
    (await Order.findOne({
      ticket: this.id,
      status: {
        $in: [
          OrderStatus.CREATED,
          OrderStatus.AWAITING_PAYMENT,
          OrderStatus.COMPLETED,
        ],
      },
    })) || null;

  return !!existingOrder;
};

export const Ticket = model<TicketDoc, TicketModel>("Ticket", ticketSchema);
