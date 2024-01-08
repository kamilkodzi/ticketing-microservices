import { Message } from 'node-nats-streaming'
import { Subjects, Listener, TicketCreatedEvent } from '@katicketing/common'
import { Ticket } from '../../models/ticket'
import { queueGroupName } from './queue-group-name'

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
  queueGrouName = queueGroupName

  async onMessage(
    data: TicketCreatedEvent['data'],
    msg: Message
  ): Promise<void> {
    const { title, price } = data
    const ticket = Ticket.build({
      id: data.id,
      title,
      price,
    })
    await ticket.save()

    msg.ack()
  }
}
