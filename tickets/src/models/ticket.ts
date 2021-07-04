import mongoose from 'mongoose'

interface TicketAttrs {
  title: string; // type in typescript - lower case
  price: number;
  userId: string;
}

interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
}

interface TicketModel extends mongoose.Model<TicketDoc>{
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String, // used by mongoose
    required: true 
  },
  price: {
    type: Number,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    transform(doc,ret){
      // try to modify ret directly, not to return
      ret.id = ret._id;
      delete ret._id;
    }
  }
})

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs)
}

const Ticket = mongoose.model<TicketDoc,TicketModel>('Ticket',ticketSchema)

export { Ticket }