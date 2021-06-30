import request from 'supertest'
import { app } from '../../app'

it('has a route handler listening to /api/tickets for post requests', 
async () => {
  const response = await request(app)
    .post('/api/tickets').send({})

    expect(response.status)
    .not.toEqual(404);
})

it('can only be accessed if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets').send({})

    expect(response.status).toEqual(401);
})

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets').send({})

    expect(response.status).not.toEqual(401);
})

it('returns an error if an invalid title is provided', async () => {

})

it('returns an error if an invalid price is provided', async () => {

})

it('creates a ticket with valid parameters', async () => {

})

// it('returns a 201 on successfull ticket creation', async () => {
//   await request(app)
//   .post('/api/users/signup')
//     .send({
//       email:'h.g@test.com',
//       password:'password'
//     })
//     .expect(201)
// 
//   await request(app)
//   .post('/api/tickets')
//     .send({
//       title:'first ticket',
//       price:'100'
//     })
//     .expect(201)
// })