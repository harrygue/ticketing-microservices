import request from 'supertest';
import {app} from '../../app';

it('fails with an not existing email', async () => {
  await request(app)
  .post('/api/users/signin')
  .send({
    email: 'h1.g@test.com',
    password: 'password'
  })
  .expect(400)
})

it('fails when an incorrect password is supplied', async () => {
  await request(app)
  .post('/api/users/signup')
  .send({
    email:'hgtest@test.com',
    password: 'password'
  })
  .expect(201)

  await request(app)
  .post('/api/users/signin')
  .send({
    email:'hgtest@test.com',
    password: 'kdsaö'
  })
  .expect(400)
})


it('respond with a cookie when given valid credentials', async () => {
  await request(app)
  .post('/api/users/signup')
  .send({
    email:'hgtest@test.com',
    password: 'password'
  })
  .expect(201)

  const response = await request(app)
  .post('/api/users/signin')
  .send({
    email:'hgtest@test.com',
    password: 'password'
  })
  .expect(200)

  expect(response.get('Set-Cookie')).toBeDefined();
})