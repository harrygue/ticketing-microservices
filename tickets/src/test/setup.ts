import { MongoMemoryServer} from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { app } from '../app'

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