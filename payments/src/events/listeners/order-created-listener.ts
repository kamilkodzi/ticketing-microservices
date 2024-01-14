import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from '@katicketing/common'
import { Message } from 'node-nats-streaming'
import { queueGroupName } from './queue-group-name'
import { Order } from '../../models/order'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
  queueGrouName = queueGroupName

  async onMessage(
    data: OrderCreatedEvent['data'],
    msg: Message
  ): Promise<void> {
    const order = Order.build({
      id: data.id,
      version: data.version,
      userId: data.userId,
      price: data.ticket.price,
      status: data.status,
    })

    await order.save()
    msg.ack()
  }
}
