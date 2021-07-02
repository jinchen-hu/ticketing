import { Document, Schema, Model, model } from "mongoose";

export interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

export interface TicketDoc extends Document {
  title: string;
  price: number;
  userId: string;
}

export interface TicketModel extends Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
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
    },
    userId: {
      type: String,
      required: true,
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

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

export const Ticket = model<TicketDoc, TicketModel>("Ticket", ticketSchema);
