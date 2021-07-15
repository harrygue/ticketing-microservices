import mongoose from 'mongoose'
import {app} from './app'
import { natsWrapper } from './nats-wrapper'


const start = async () => {
  // check if jsonwebtoken has beed defined at app start
  if (!process.env.jwt){
    throw new Error('jwt must be defined!')
  }

  if (!process.env.ORDERS_MONGO_URI) {
    throw new Error('ORDER MONGO_URI must be defined!')
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined!')
  }

  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined!')
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined!')
  }

  try {
    // clusterId,clientId,url
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL);

    // 323: Graceful Termination:
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });

    process.on('SIGINT',() => natsWrapper.client.close());
    process.on('SIGTERM',() => natsWrapper.client.close());

    await mongoose.connect(process.env.ORDERS_MONGO_URI,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true  
    })
    console.log('CONNECTED TO MONGODB orders')
  } catch(err){
    console.log('MONGODB tickets ERROR:\n',err)
  }

  app.listen(3001,() => {
    console.log('listening on 3001!!!')
  })
}

start()