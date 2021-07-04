import express, {Request, Response } from 'express'
import { body } from 'express-validator'
import { requireAuth,validatateRequest,currentUser } from '@harrygueorg/common';
// import { requireAuth } from '../middlewares/require-auth'; //temp
// import { currentUser } from '../middlewares/current-user'; //temp
// import { validatateRequest } from '../middlewares/validate-request'; // temp
import { Ticket } from '../models/ticket';

const router = express.Router();

router.post('/api/tickets',currentUser,requireAuth,[
  body('title')
    .not()
    .isEmpty()
    .withMessage('Title is required'),
  body('price')
    .isFloat({ gt: 0}) // greater than
    .withMessage('Price must be greater than 0')
],validatateRequest, 
async (req:Request,res:Response) => {
  const { title, price } = req.body;
  console.log('CURRENT USER: ')
  console.log(title, price)
  req.currentUser && console.log(req.currentUser)
  const ticket = Ticket.build({
    title,price,
    userId: req.currentUser!.id
  })
  await ticket.save();
  res.status(201).send(ticket);
})

export { router as createTicketRouter }