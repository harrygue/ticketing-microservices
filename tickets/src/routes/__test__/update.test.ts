import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'

// actually the mock is called
import { natsWrapper} from '../../nats-wrapper';

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie',global.signin())
    .send({
      title: "djskalö",
      price: 20
    })
    .expect(404);
})

it('returns a 401 if the user is not authenicated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "djskalö",
      price: 20
    })
    .expect(401);
})

it('returns a 401 if the user does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie',global.signin())
    .send({
      title: "djskalö",
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

it('returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie',cookie)
    .send({
      title: "djskalö",
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

it('updates the ticket provided valid input', async () => {
  const cookie = global.signin();
  console.log('Cookie: ',cookie)
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie',cookie)
    .send({
      title: "djskalö",
      price: 20
    });

  console.log('RESPONSE BODY ID: ',response.body.id)
  
  const updateResponse = await request(app)
    .put(`/api/ticket/${response.body.id}`)
    .set('Cookie',cookie)
    .send({
      title: 'new title',
      price: 100
    })
    .expect(200);
  
  console.log('UPDATE RESPONSE: ',updateResponse.body.title)
  const ticketResponse = await request(200)
    .get('/api/tickets/${response.body.id}')
    .send()

  expect(ticketResponse.body.title).toEqual('new title');
  expect(ticketResponse.body.price).toEqual(100);
});

it('publishes an event',async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie',cookie)
    .send({
      title: "djskalö",
      price: 20
    });

  await request(app)
    .put(`/api/ticket/${response.body.id}`)
    .set('Cookie',cookie)
    .send({
      title: 'new title',
      price: 100
    })
    .expect(200);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
})