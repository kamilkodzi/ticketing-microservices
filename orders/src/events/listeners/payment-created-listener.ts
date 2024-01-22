import {
  Subjects,
  Listener,
  PaymentCompletedEvent,
  OrderStatus,
} from '@katicketing/common'
import { queueGroupName } from './queue-group-name'
import { Message } from 'node-nats-streaming'
import { Order } from '../../models/order'

export class PaymentCreatedListener extends Listener<PaymentCompletedEvent> {
  readonly subject = Subjects.PaymentCreated
  queueGrouName = queueGroupName
  async onMessage(
    data: PaymentCompletedEvent['data'],
    msg: Message
  ): Promise<void> {
    const order = await Order.findById(data.orderId)
    if (!order) {
      throw new Error('Order not found')
    }
    order.set({ status: OrderStatus.Complete })
    await order.save()
    
    msg.ack()
  }
}
