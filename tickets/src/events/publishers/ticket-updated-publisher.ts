import { Publisher, Subjects,TicketUpdatedEvent} from '@harrygueorg/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}