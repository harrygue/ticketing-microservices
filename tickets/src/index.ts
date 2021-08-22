import mongoose from 'mongoose'
import {app} from './app'
import { natsWrapper } from './nats-wrapper'
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';


const start = async () => {
  // check if jsonwebtoken has beed defined at app start
  if (!process.env.jwt){
    throw new Error('jwt must be defined!')
  }

  if (!process.env.TICKETS_MONGO_URI) {
    throw new Error('MONGO_URI must be defined!')
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
    
    // listen to the events
    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();


    await mongoose.connect(process.env.TICKETS_MONGO_URI,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true  
    })
    console.log('CONNECTED TO MONGODB tickets')
  } catch(err){
    console.log('MONGODB tickets ERROR:\n',err)
  }

  app.listen(3001,() => {
    console.log('listening on 3001!!!')
  })
}

start()