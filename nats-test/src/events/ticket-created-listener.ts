import { Message } from 'node-nats-streaming'
import { Listener } from '../../../common/src/events/base-listeners'
import { TicketCreatedEvent } from '../../../common/src/events/ticket-created-events'
import { Subjects } from '../../../common/src/events/subjects'

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
  queueGrouName = 'payments-service'
  onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
    console.log('Event data!', data)

    console.log(data.id)
    console.log(data.price)

    msg.ack()
  }
}
