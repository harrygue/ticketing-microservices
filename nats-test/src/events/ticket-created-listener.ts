import {Message} from 'node-nats-streaming';
import {Listener} from '@harrygueorg/common'; //'./base-listener';
import { TicketCreatedEvent } from '@harrygueorg/common'; //'./ticket-created-event';
import { Subjects } from '@harrygueorg/common'; //'./subjects';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  // subject must be always equal to Subjects.TicketCreated
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = 'payments-service';

  onMessage(data:TicketCreatedEvent['data'],msg:Message){
    // business logic
    console.log('Event data:', data);

    msg.ack();
  }
}