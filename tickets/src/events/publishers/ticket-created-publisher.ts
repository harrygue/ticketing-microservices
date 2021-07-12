import { Publisher, Subjects,TicketCreatedEvent} from '@harrygueorg/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}