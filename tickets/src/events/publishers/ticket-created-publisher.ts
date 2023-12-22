import { Publisher, Subjects, TicketCreatedEvent } from '@katicketing/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
}
