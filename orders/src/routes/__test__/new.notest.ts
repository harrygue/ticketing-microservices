import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { Order,OrderStatus } from '../../models/order'
// actually the mock is called
import { natsWrapper} from '../../nats-wrapper';

it('returns an error if ticket does not exist',async () => {
  const ticketId = mongoose.Types.ObjectId();

  await request(app)
    .post('/api/orders')
    .set('Cookie',global.signin())
    .send({ticketId})
    .expect(404)
})

it('returns an error if the ticket is already reserved',async () => {
  const ticket = Ticket.build({
    title: 'CONCERT1',
    price: 20
  });
  const ticketResponse = await ticket.save();

  console.log('ticket: ',ticket._id)
  const order = Order.build({
    ticket: ticket,
    userId: 'uioiopiop',
    status: OrderStatus.Created,
    expiresAt: new Date()
  })
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie',global.signin())
    .send({ticketId: ticket._id})
    .expect(400) // 400
})

it('reserves a ticket',async() => {
  const ticket = Ticket.build({
    title: 'CONCERT2',
    price: 30
  });
  await ticket.save();
  const resp2 = await request(app)
    .post('/api/orders')
    .set('Cookie',global.signin())
    .send({ticketId: ticket._id})
    .expect(201) //201
})

it.todo('emits an order created event');