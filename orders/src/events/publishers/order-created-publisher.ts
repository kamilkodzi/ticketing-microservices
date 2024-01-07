import { Publisher, OrderCreatedEvent, Subjects } from '@katicketing/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
}
