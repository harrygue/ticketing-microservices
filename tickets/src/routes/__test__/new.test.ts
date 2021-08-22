import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
// actually the mock is called
import { natsWrapper} from '../../nats-wrapper';

it('1) has a route handler listening to /api/tickets for post requests', 
async () => {
  const response = await request(app)
    .post('/api/tickets').send({})

    expect(response.status)
    .not.toEqual(404);
})

it('2) can only be accessed if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    // .set('Cookie',global.signin())
    .send({})
    .expect(401)
})

it('3) returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie',global.signin())
    .send({})

    console.log('RESPONSE STATUS::: ',response.status)
    expect(response.status).not.toEqual(401);
})

it('4) returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie',global.signin())
    .send({
      title:'',
      price:100
    })
    .expect(400)

  await request(app)
    .post('/api/tickets')
    .set('Cookie',global.signin())
    .send({
      price:100
    })
    .expect(400)
})

it('5) returns an error if an invalid price is provided', async () => {
  await request(app)
  .post('/api/tickets')
  .set('Cookie',global.signin())
  .send({
    title:'gfds',
    price:-10
  })
  .expect(400)

  await request(app)
    .post('/api/tickets')
    .set('Cookie',global.signin())
    .send({
      title:'valid'

    })
    .expect(400)
})

it('6) creates a ticket with valid parameters', async () => {
  // add in a check to make sure a ticket was saved to db
  let tickets = await Ticket.find({})
  expect(tickets.length).toEqual(0)

  await request(app)
  .post('/api/tickets')
  .set('Cookie',global.signin())
  .send({
    title:'validTitle',
    price: 20
  })
  .expect(201)

  tickets = await Ticket.find({})
  expect(tickets.length).toEqual(1)
  expect(tickets[0].price).toEqual(20)
  expect(tickets[0].title).toEqual('validTitle')
})

it('7) publishes an event',async () => {
  await request(app)
  .post('/api/tickets')
  .set('Cookie',global.signin())
  .send({
    title:'validTitle',
    price: 20
  })
  .expect(201)

  console.log(natsWrapper)
  expect(natsWrapper.client.publish).toHaveBeenCalled();
})

