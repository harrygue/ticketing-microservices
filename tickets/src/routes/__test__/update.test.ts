import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { Ticket } from '../../models/ticket';
// actually the mock is called
import { natsWrapper} from '../../nats-wrapper';

it('1) returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie',global.signin())
    .send({
      title: "harald1",
      price: 20
    })
    .expect(404);
})

it('2) returns a 401 if the user is not authenicated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "harald2",
      price: 20
    })
    .expect(401);
})

it('3) returns a 401 if the user does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie',global.signin())
    .send({
      title: "harald3",
      price: 20
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie',global.signin())
    .send({
      title: "randString",
      price: 2000
    })
    .expect(401)
})

it('4) returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie',cookie)
    .send({
      title: "harald4",
      price: 20
    });
  
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie',cookie)
    .send({
      title: "",
      price: 20
    })
    .expect(400)
  
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie',cookie)
    .send({
      title: "",
      price: 20
    })
    .expect(400)
})

it('5) updates the ticket provided valid input', async () => {
  const cookie = global.signin();
  console.log('Cookie: ',cookie)
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie',cookie)
    .send({
      title: "harald6",
      price: 20
    });

  console.log('RESPONSE BODY: ',response.body)
  const updateResponse = await request(app)
    .put(`/api/ticket/${response.body.id}`)
    .set('Cookie',cookie)
    .send({
      title: 'new title',
      price: 100
    })
    // .expect(200); //200
  
  // console.log('UPDATE RESPONSE: ',updateResponse.body.title)
  const ticketResponse = await request(app)
    .get('/api/tickets/${response.body.id}')
    .send()

  expect(ticketResponse.body.title).toEqual('new title');
  expect(ticketResponse.body.price).toEqual(100);
});

it('6) publishes an event',async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie',cookie)
    .send({
      title: "harald7",
      price: 20
    });
  
  await request(app)
    .put(`/api/ticket/${response.body.id}`)
    .set('Cookie',cookie)
    .send({
      title: 'new title',
      price: 100
    })
    .expect(200); // 200
  expect(natsWrapper.client.publish).toHaveBeenCalled();
})

it('rejects updates if the ticket is reserved', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asldkfj',
      price: 20,
    });

  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({ orderId: mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 100,
    })
    .expect(400);
});