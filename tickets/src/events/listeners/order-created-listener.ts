import { Listener, OrderStatus, Subjects } from '@katicketing/common'
import { OrderCreatedEvent } from '@katicketing/common'
import { Message } from 'node-nats-streaming'
import { queueGroupName } from './queue-group'
import { Ticket } from '../../models/ticket'
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
  queueGrouName = queueGroupName
  async onMessage(
    data: OrderCreatedEvent['data'],
    msg: Message
  ): Promise<void> {
    // Find ticket that order is reserving
    const ticket = await Ticket.findById(data.ticket.id)
    // If no ticket throw an error
    if (!ticket) {
      throw new Error('Ticket not found')
    }
    // Mark ticket as been reserved by setting its orderId
    ticket.set({ orderId: data.id })
    // Save the ticket
    await ticket.save()

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
    })

    // ack the message
    msg.ack()
  }
}
