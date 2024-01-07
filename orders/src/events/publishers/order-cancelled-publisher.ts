import { Publisher, Subjects, OrderCancelledEvent } from '@katicketing/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
}
