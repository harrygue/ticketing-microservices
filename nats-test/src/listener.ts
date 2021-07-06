import nats,{Message} from 'node-nats-streaming'
import { randomBytes } from 'crypto';

console.clear()

const stan = nats.connect('ticketing',randomBytes(4).toString('hex'),{
  url: 'http://localhost:4222'
});


stan.on('connect', () => {
  console.log('Listener connected to NATS')

  // this is to detect that the listener has been closed
  stan.on('close',() => {
    console.log('Nats connection closed')
    process.exit();
  })


  // subscriptionOptions will be chained !!!
  const options = stan.subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName('order-service');
  const subscription = stan.subscribe(
    'ticket:created',
    'order-service-queue-group', // temprarily commented out in section 297
    options
  );
  subscription.on('message',(msg:Message) => {
    const data = msg.getData();

    if(typeof data === 'string'){
      console.log(
        `Received event #${msg.getSequence()}, with data: ${data}}`
      )
    }

    msg.ack();
  })
})

// handlers to detect interruption or termination
// here the listener tels nats to disregard it in case of events
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close())
