import { MongoMemoryServer} from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request from 'supertest';
import { app } from '../app'

// this is to declare TS that there is a global signin function
// which resolved in a Promise of type array of strings
declare global {
  namespace NodeJS {
    interface Global {
      signin(): Promise<string[]>
    }
  }
}

let mongo: any;

// hook, which runs before all tests
beforeAll(async () => {
  process.env.jwt = 'asdfasdf'
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();
  await mongoose.connect(mongoUri,{
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
})

// runs every time before a test starts
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections){
    await collection.deleteMany({});
  }
})

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
})

// this global function is only available to the tests, not to the regular app stuff
// purpose: avoid to always write some cookie fetching stuff to make authenicated requests
global.signin = async () => {
  const email = 'hgtest@test.com';
  const password = 'password'

  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email,password
    }).expect(201)

  const cookie = response.get('Set-Cookie')
  return cookie;
}