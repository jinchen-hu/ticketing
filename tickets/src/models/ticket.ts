import { Document, Schema, Model, model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
export interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

export interface TicketDoc extends Document {
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string;
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
    orderId: {
      type: String,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
    versionKey: "version",
  }
);
//ticketSchema.set("versionKey", "version");
// increment the version number
// Only the primary service responsible for a record emits an
// event to describe a create/update/destroy to a record
ticketSchema.plugin(updateIfCurrentPlugin);
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

export const Ticket = model<TicketDoc, TicketModel>("Ticket", ticketSchema);
