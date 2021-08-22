import express, {Request, Response } from 'express'
import { body } from 'express-validator'
import { 
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
  BadRequestError,
  currentUser
 } from '@harrygueorg/common';
import { Ticket } from '../models/ticket';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router()

router.put('/api/tickets/:id',
  currentUser,
  requireAuth,
  [
    body('title')
      .not()
      .isEmpty()
      .withMessage('Title is required'),
    body('price')
      .isFloat({gt: 0})
      .withMessage('Price must be provided and be greater than 0')
  ],
  validateRequest,
  async (req:Request,res:Response) => {
    console.log('REQ.PARAMS.ID: ',req.params.id)
    const ticket = await Ticket.findById(req.params.id)
    if (!ticket) {
      throw new NotFoundError();
    }

    // check if ticket is reserved
    if (ticket.orderId) {
      throw new BadRequestError('Cannot edit a reserved ticket');
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }

    ticket.set({
      title: req.body.title,
      price: req.body.price
    });

    await ticket.save(); // here the update is written into the db

    // same as in new.ts
    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId:ticket.userId,
      version: ticket.version,
    })

    res.send(ticket);

  }
)

export { router as updateTicketRouter };

