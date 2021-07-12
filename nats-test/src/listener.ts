import nats,{Message, Stan} from 'node-nats-streaming'
import { randomBytes } from 'crypto';
import { TicketCreatedListener} from './events/ticket-created-listener';

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

  new TicketCreatedListener(stan).listen();

})

// handlers to detect interruption or termination
// here the listener tels nats to disregard it in case of events
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close())
