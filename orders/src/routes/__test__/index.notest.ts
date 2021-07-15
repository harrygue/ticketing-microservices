import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { Order,OrderStatus } from '../../models/order'

console.clear();

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: 'CONCERT 3',
    price: 40
  })
  await ticket.save();
  return ticket;
}



it('fetches orders for an particular user', async () => {

  // Create 3 tickets
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  const userOne = global.signin();
  const userTwo = global.signin();
  // Create one order as user #1
  const resp1 = await request(app)
    .post('/api/orders')
    .set('Cookie',userOne)
    .send({ticketId: ticketOne._id})
    .expect(201)
  console.log('RESP1:',resp1)
  // Create two orders as user #2
  const resp2 = await request(app)
    .post('/api/orders')
    .set('Cookie',userTwo)
    .send({ticketId: ticketTwo._id})
    .expect(201)
  const resp3 = await request(app)
    .post('/api/orders')
    .set('Cookie',userTwo)
    .send({ticketId: ticketThree._id})
    .expect(201)

  console.log('ORDERS:')
  console.log(resp1,resp2,resp3)

  // make request to get orders for user #2
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie',userTwo)
    .expect(200);

  // Make sure we only got the orders for user #2
  expect(response.body.length).toEqual(2);
})