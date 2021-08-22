import { Subjects, Publisher, OrderCancelledEvent } from '@harrygueorg/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
