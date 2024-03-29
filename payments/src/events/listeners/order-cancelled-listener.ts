import {
  OrderCancelledEvent,
  Subjects,
  Listener,
  OrderStatus,
} from '@katicketing/common'
import { Message } from 'node-nats-streaming'
import { queueGroupName } from './queue-group-name'
import { Order } from '../../models/order'

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
  queueGrouName = queueGroupName
  async onMessage(
    data: OrderCancelledEvent['data'],
    msg: Message
  ): Promise<void> {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    })
    if (!order) {
      throw new Error('Order not found')
    }

    order.set({ status: OrderStatus.Canceled })
    await order.save()
    msg.ack()
  }
}
