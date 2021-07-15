import express, {Request,Response} from 'express';
import { requireAuth, validatateRequest,NotFoundError, OrderStatus, BadRequestError } from '@harrygueorg/common';
import { body} from 'express-validator';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import mongoose from 'mongoose';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post('/app/orders',requireAuth,[
  body('ticketId')
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    // .isMongoId()
    .withMessage('TicketId must be provided!')
],validatateRequest, async (req:Request,res:Response) => {
  const { ticketId } = req.body;
  console.log('ticketId: ',ticketId)
  // find the ticket the user is trying to order in the db
  const ticket = await Ticket.findById(ticketId);

  if (!ticket){
    throw new NotFoundError();
  }
  console.log('ticket.id', ticket.id)

  
  // Make sure that the ticket isn't reserved
  // logic 'Order.findOne({...})' was pushed into ticket.ts
  
  const isReserved = await ticket.isReserved();

  if(isReserved){
    throw new BadRequestError('Ticket is already reserved, choose another one!');
  }

  // Calculate an expiration date
  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);
  
  // Build the order and save it to the database
  const order = Order.build({
    userId: req.currentUser!.id,
    status: OrderStatus.Created,
    expiresAt: expiration,
    ticket
  })

  await order.save();

  // Publish an event saying that an order was created
  
  res.status(201).send(order)
})

export { router as newOrderRouter};