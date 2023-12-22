import { Publisher, Subjects, TicketUpdatedEvent } from '@katicketing/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
}
