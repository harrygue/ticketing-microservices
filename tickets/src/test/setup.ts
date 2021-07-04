import { MongoMemoryServer} from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { app } from '../app'
import request from 'supertest'
import jwt from 'jsonwebtoken'

// this is to declare TS that there is a global signin function
// which resolved in a Promise of type array of strings
declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[]
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

global.signin = () => {
  // build JWT payload. {id, email}
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  }
  // Create the JWT in my case its jwt instead of JWT_KEY
  const token = jwt.sign(payload, process.env.jwt!)

  // Build session object {jwt: MY_JWT}
  const session = {jwt:token}

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session)

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64')

  // return a string that is the cookie with the encoded data
  return [`express:sess=${base64}`]
}