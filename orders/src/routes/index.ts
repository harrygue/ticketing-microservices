import { requireAuth } from '@harrygueorg/common';
import express, {Request,Response} from 'express';
import { Order } from '../models/order';

const router = express.Router();

// krouter.get('/api/orders',(req:Request,res:Response) => {
// k  console.log('Hi from orders fake index get')
// k  res.send('Hi from orders fake index')
// k})

router.get('/app/orders',requireAuth, async (req:Request,res:Response) => {
  
  const orders = await Order.find({
    userId: req.currentUser!.id
  }).populate('ticket');
  
  res.send(orders)
})

export { router as indexOrderRouter};